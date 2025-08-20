import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserId } from "@/app/lib/database/getUserId";
import { randomUUID } from "crypto";
import sharp from "sharp";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Decode and normalize the original; cap dimensions and size before temp upload
    const inputBuf = Buffer.from(await file.arrayBuffer());
    const img = sharp(inputBuf).rotate();
    const meta = await img.metadata();

    const MAX_DIM = 1600;
    const TARGET_MAX_BYTES = 4 * 1024 * 1024; // ~4MB

    // If image has alpha channel, prefer PNG with palette; else JPEG for better size
    const hasAlpha = Boolean(meta.hasAlpha);

    let processed: Buffer | undefined;
    if (hasAlpha) {
      // PNG path
      processed = await sharp(inputBuf)
        .rotate()
        .resize({
          width: MAX_DIM,
          height: MAX_DIM,
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true,
          colors: 128,
          effort: 10,
        })
        .toBuffer();

      if (processed.byteLength > TARGET_MAX_BYTES) {
        const colorSteps = [96, 64, 48, 32, 24, 16, 8];
        for (const colors of colorSteps) {
          const q: Buffer = await sharp(processed!)
            .png({
              compressionLevel: 9,
              adaptiveFiltering: true,
              palette: true,
              colors,
              effort: 10,
            })
            .toBuffer();
          processed = q;
          if (processed.byteLength <= TARGET_MAX_BYTES) break;
        }
      }
    } else {
      // JPEG path
      const qualities = [85, 80, 75, 70, 65, 60, 55, 50];
      let last: Buffer | null = null;
      for (const q of qualities) {
        const out = await sharp(inputBuf)
          .rotate()
          .resize({
            width: MAX_DIM,
            height: MAX_DIM,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: q, mozjpeg: true })
          .toBuffer();
        last = out;
        if (out.byteLength <= TARGET_MAX_BYTES) {
          processed = out;
          break;
        }
      }
      // Ensure processed is always assigned
      if (!processed && last) {
        processed = last;
      }
      // Fallback: if still not assigned, use the first quality attempt
      if (!processed) {
        processed = await sharp(inputBuf)
          .rotate()
          .resize({
            width: MAX_DIM,
            height: MAX_DIM,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 50, mozjpeg: true })
          .toBuffer();
      }
    }

    const bytes = new Uint8Array(processed);
    const ext = hasAlpha ? "png" : "jpg";
    const contentType = hasAlpha ? "image/png" : "image/jpeg";

    const tmpName = `orig_${Date.now()}_${randomUUID()}.${ext}`;
    const tmpPath = `${userId}/tmp/${tmpName}`;

    const { error: uploadErr } = await supabase.storage
      .from("user-images")
      .upload(tmpPath, bytes, { contentType, upsert: false });

    if (uploadErr) {
      return NextResponse.json(
        { error: "Temp upload failed", details: uploadErr.message },
        { status: 500 }
      );
    }

    // Prefer a signed URL so private buckets work
    let imageUrl: string | null = null;
    const { data: signed, error: signedErr } = await supabase.storage
      .from("user-images")
      .createSignedUrl(tmpPath, 60 * 10); // 10 minutes

    if (!signedErr && signed?.signedUrl) {
      imageUrl = signed.signedUrl;
    } else {
      const { data: pub } = supabase.storage
        .from("user-images")
        .getPublicUrl(tmpPath);
      imageUrl = pub.publicUrl;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Failed to generate URL for uploaded file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Upload original failed", details: String(e) },
      { status: 500 }
    );
  }
}
