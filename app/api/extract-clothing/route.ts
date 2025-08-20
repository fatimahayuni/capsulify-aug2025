import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserId } from "@/app/lib/database/getUserId";
import { insertUserImage } from "@/app/lib/database/user_images";
import { fal } from "@fal-ai/client";
import { randomUUID } from "crypto";
import sharp from "sharp";

// Ensure this route runs in the Node.js runtime
export const runtime = "nodejs";

// Initialize Supabase with service role for server-side storage ops
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Clothing category prompts for Flux Pro (sentence-style as requested)
const CLOTHING_PROMPTS: Record<number, string> = {
  1: "extract the top only. no human model: no legs, body, neck, arms, hands, head. generate the top in a straight, clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve the clothes exactly as it is.",
  2: "extract the pants only. no human model: no human legs, body, neck, arms, hands, head. generate the pants in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve the clothes exactly as it is.",
  3: "extract the dress only. no human model: no legs, body, neck, arms, hands, head. generate the dress in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve the clothes exactly as it is.",
  4: "extract the top layer only. no human model: no legs, body, neck, arms, hands, head. generate the top layer in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, length or details. preserve the clothes exactly as it is.",
  5: "extract the bag only. no human model: no legs, body, neck, arms, hands, head. generate the bag in a straight clean view. 1205 x 1205 dimension. do not alter shape, color, size or details. preserve the item exactly as it is.",
  6: "extract the shoes only. no human model: no legs, body, neck, arms, hands, head. generate the shoes side by side in a straight clean view (one front view and one side view if present in the input). 1205 x 1205 dimension. do not alter shape, color, length or details. preserve the item exactly as it is.",
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
    if (!categoryId) {
      return NextResponse.json(
        { error: "No category ID provided" },
        { status: 400 }
      );
    }

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Configure Fal
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "Missing FAL_KEY environment variable" },
        { status: 500 }
      );
    }
    fal.config({ credentials: process.env.FAL_KEY });

    // Get the appropriate prompt for this category
    const prompt = CLOTHING_PROMPTS[categoryId as number];
    if (!prompt) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    console.log(
      `Extracting clothing with prompt: "${prompt}" for category ${categoryId}`
    );

    // Step 1: Use Flux Pro (kontext) to extract the clothing item (prompt-required)
    const fluxResult = await fal.subscribe("fal-ai/flux-pro/kontext", {
      input: {
        image_url: imageUrl,
        prompt: prompt,
      },
      logs: true,
      onQueueUpdate: (u) => {
        if (u.status === "IN_PROGRESS") {
          u.logs?.forEach((l) => console.log("[Flux Pro]", l.message));
        }
      },
    });

    // Extract the segmented image URL from Flux Pro response
    const segmentedImageUrl =
      (fluxResult?.data as any)?.image?.url ||
      (fluxResult?.data as any)?.url ||
      (Array.isArray((fluxResult?.data as any)?.images)
        ? (fluxResult?.data as any).images[0]?.url
        : undefined);

    if (!segmentedImageUrl) {
      return NextResponse.json(
        {
          error: "Flux Pro failed to extract clothing",
          details: "No output URL found",
        },
        { status: 502 }
      );
    }

    // Step 2: Remove background from the segmented clothing
    const bgRemovalResult = await fal.subscribe("smoretalk-ai/rembg-enhance", {
      input: {
        image_url: segmentedImageUrl,
      },
      logs: true,
      onQueueUpdate: (u) => {
        if (u.status === "IN_PROGRESS") {
          u.logs?.forEach((l) =>
            console.log("[Background Removal]", l.message)
          );
        }
      },
    });

    // Extract the final processed image URL
    const finalImageUrl =
      (bgRemovalResult?.data as any)?.image?.url ||
      (bgRemovalResult?.data as any)?.url ||
      (Array.isArray((bgRemovalResult?.data as any)?.images)
        ? (bgRemovalResult?.data as any).images[0]?.url
        : undefined);

    if (!finalImageUrl) {
      return NextResponse.json(
        { error: "Background removal failed", details: "No output URL found" },
        { status: 502 }
      );
    }

    // Step 3: Download and post-process to 1205x1205 transparent canvas
    const response = await fetch(finalImageUrl);
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch processed image",
          details: `HTTP ${response.status}`,
        },
        { status: 502 }
      );
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Enforce 1205 x 1205 with transparent padding, keep aspect ratio
    const SIZE = 1205;
    let outputPng: Buffer;
    try {
      outputPng = await sharp(imageBuffer)
        .rotate()
        .resize({
          width: SIZE,
          height: SIZE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true,
          colors: 128,
        })
        .toBuffer();

      // Pad to exact square if needed
      const padded = await sharp({
        create: {
          width: SIZE,
          height: SIZE,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: outputPng,
            gravity: "center",
          },
        ])
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true,
          colors: 128,
        })
        .toBuffer();
      outputPng = padded;

      // Iteratively reduce size until under ~8MB
      const TARGET_MAX_BYTES = 8 * 1024 * 1024;
      let dim = 1100;
      let colors = 96;
      while (outputPng.byteLength > TARGET_MAX_BYTES && dim >= 700) {
        outputPng = await sharp(imageBuffer)
          .rotate()
          .resize({
            width: dim,
            height: dim,
            fit: "inside",
            withoutEnlargement: true,
          })
          .png({
            compressionLevel: 9,
            adaptiveFiltering: true,
            palette: true,
            colors,
          })
          .toBuffer();
        outputPng = await sharp({
          create: {
            width: SIZE,
            height: SIZE,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          },
        })
          .composite([{ input: outputPng, gravity: "center" }])
          .png({
            compressionLevel: 9,
            adaptiveFiltering: true,
            palette: true,
            colors,
          })
          .toBuffer();
        dim -= 100;
        colors = Math.max(32, colors - 16);
      }
    } catch (err) {
      // Fallback to original bytes
      outputPng = imageBuffer;
    }

    if (outputPng.byteLength === 0) {
      return NextResponse.json(
        {
          error: "Processed image is empty",
          details: "No image data received",
        },
        { status: 502 }
      );
    }

    // Upload to Supabase using Uint8Array
    const finalName = `user_${userId}_${Date.now()}_${randomUUID()}_extracted.png`;
    const finalPath = `${userId}/${finalName}`;

    const { error: uploadErr } = await supabase.storage
      .from("user-images")
      .upload(finalPath, new Uint8Array(outputPng), {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadErr) {
      return NextResponse.json(
        { error: "Upload failed", details: uploadErr.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("user-images")
      .getPublicUrl(finalPath);
    const publicUrl = publicUrlData.publicUrl;

    // Insert into database
    const insertedId = await insertUserImage(
      userId,
      finalName,
      publicUrl,
      parseInt(categoryId, 10)
    );

    if (!insertedId) {
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        imageUrl: publicUrl,
        id: insertedId,
        message: `Successfully extracted item for category ${categoryId}`,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error in extract-clothing:", e);
    return NextResponse.json(
      { error: "Clothing extraction failed", details: String(e) },
      { status: 502 }
    );
  }
}
