import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserId } from "@/app/lib/database/getUserId";
import { insertUserImage } from "@/app/lib/database/user_images";
import { randomUUID } from "crypto";
import sharp from "sharp";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PROMPTS: Record<number, string> = {
  1: "extract the top only. no human model: no legs, body, neck, arms, hands, head. generate the top in a straight, clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve the clothes exactly as it is.",
  2: "extract the pants only. no human model: no legs, body, neck, arms, hands, head. generate the pants in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve exactly as input.",
  3: "extract the dress only. no human model: no legs, body, neck, arms, hands, head. generate the dress in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve exactly as input.",
  4: "extract the top layer only. no human model: no legs, body, neck, arms, hands, head. generate the top layer in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve exactly as input.",
  5: "extract the bag only. no human model: no legs, body, neck, arms, hands, head. generate the bag in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, size or details. preserve exactly as input.",
  6: "extract the shoes only. no human model: no legs, body, neck, arms, hands, head. generate the shoes side by side in a straight clean view (one front view and one side view if present in the input). 1205 x 1205 dimension. do not alter shape, color, length or details. preserve exactly as input.",
};

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, categoryId } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }
    if (!categoryId || !PROMPTS[categoryId]) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Fetch the original image bytes
    const orig = await fetch(imageUrl);
    if (!orig.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch original image",
          details: `HTTP ${orig.status}`,
        },
        { status: 502 }
      );
    }
    const origBuf = Buffer.from(await orig.arrayBuffer());

    // Call OpenAI Images Edits via REST
    const prompt = PROMPTS[categoryId];
    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("prompt", prompt);
    form.append("size", "1024x1024");
    form.append("background", "transparent");
    form.append(
      "image",
      new Blob([origBuf], { type: "image/png" }),
      "input.png"
    );

    const resp = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: form,
    });

    if (!resp.ok) {
      let details: any = undefined;
      try {
        details = await resp.json();
      } catch {}
      return NextResponse.json(
        { error: "OpenAI edit request failed", details },
        { status: 502 }
      );
    }

    const editJson: any = await resp.json();
    const first = editJson?.data?.[0] ?? null;

    let outPng: Buffer | null = null;
    if (first?.b64_json) {
      outPng = Buffer.from(first.b64_json, "base64");
    } else if (first?.url) {
      const r2 = await fetch(first.url);
      if (!r2.ok) {
        return NextResponse.json(
          {
            error: "Failed to fetch OpenAI image url",
            details: `HTTP ${r2.status}`,
          },
          { status: 502 }
        );
      }
      outPng = Buffer.from(await r2.arrayBuffer());
    } else {
      return NextResponse.json(
        { error: "OpenAI returned no usable image" },
        { status: 502 }
      );
    }

    // Resize to 1205x1205 and compress; if still large, step down canvas + colors
    const TARGET_MAX_BYTES = 2 * 1024 * 1024; // ~2MB
    const CANVAS_STEPS = [1205, 1100, 1000, 900, 800, 700, 600];
    const COLOR_STEPS = [128, 96, 64, 48, 32, 24, 16, 8];

    let best: Buffer | null = null;
    for (const size of CANVAS_STEPS) {
      let resized = await sharp(outPng)
        .ensureAlpha()
        .resize({
          width: size,
          height: size,
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();

      for (const colors of COLOR_STEPS) {
        const q = await sharp(resized)
          .png({
            compressionLevel: 9,
            adaptiveFiltering: true,
            palette: true,
            colors,
            effort: 10,
          })
          .toBuffer();
        if (q.byteLength <= TARGET_MAX_BYTES) {
          best = q;
          break;
        }
        best = q; // keep the latest attempt even if larger
      }
      if (best && best.byteLength <= TARGET_MAX_BYTES) break;
    }

    outPng = best ?? outPng;

    if (!outPng || outPng.byteLength === 0) {
      return NextResponse.json(
        { error: "Processed image is empty" },
        { status: 502 }
      );
    }

    if (outPng.byteLength > TARGET_MAX_BYTES) {
      return NextResponse.json(
        {
          error: "Processed image too large after compression",
          details: `${Math.round(outPng.byteLength / 1024)} KB`,
        },
        { status: 502 }
      );
    }

    // Upload to Supabase
    const fileName = `user_${userId}_${Date.now()}_${randomUUID()}_extracted.png`;
    const filePath = `${userId}/${fileName}`;
    const { error: upErr } = await supabase.storage
      .from("user-images")
      .upload(filePath, new Uint8Array(outPng), {
        contentType: "image/png",
        upsert: false,
      });

    if (upErr) {
      return NextResponse.json(
        {
          error: "Upload failed",
          details: upErr.message,
          sizeKB: Math.round(outPng.byteLength / 1024),
        },
        { status: 500 }
      );
    }

    const { data: pub } = supabase.storage
      .from("user-images")
      .getPublicUrl(filePath);
    const publicUrl = pub.publicUrl;

    const id = await insertUserImage(
      userId,
      fileName,
      publicUrl,
      parseInt(String(categoryId), 10)
    );
    if (!id) {
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: publicUrl, id }, { status: 200 });
  } catch (e: any) {
    console.error("extract-clothing-openai error", e);
    return NextResponse.json(
      { error: "OpenAI extraction failed", details: String(e) },
      { status: 502 }
    );
  }
}
