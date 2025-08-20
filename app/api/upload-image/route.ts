import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserId } from "@/app/lib/database/getUserId";
import { insertUserImage } from "@/app/lib/database/user_images";
import { fal } from "@fal-ai/client"; // ← add
import { randomUUID } from "crypto";
import sharp from "sharp";

// Ensure this route runs in the Node.js runtime (Fal client + binary ops)
export const runtime = "nodejs";

// Initialize Supabase with service role for server-side storage ops
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Parse form data
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const categoryId = formData.get("categoryId") as string;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!categoryId)
    return NextResponse.json(
      { error: "No category provided" },
      { status: 400 }
    );

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Optional: size cap ~10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 10MB)" },
      { status: 413 }
    );
  }

  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Configure Fal (expects FAL_KEY in env)
  if (!process.env.FAL_KEY) {
    return NextResponse.json(
      { error: "Missing FAL_KEY environment variable" },
      { status: 500 }
    );
  }
  fal.config({ credentials: process.env.FAL_KEY });

  // 1) TEMP UPLOAD ORIGINAL to get a public URL for Fal
  const origExt = (file.name.split(".").pop() || "jpg").toLowerCase();
  const origName = `user_${userId}_${Date.now()}_${randomUUID()}.${origExt}`;
  const tmpPath = `${userId}/tmp/${origName}`;

  const { error: tmpErr } = await supabase.storage
    .from("user-images")
    .upload(tmpPath, file, { contentType: file.type, upsert: false });

  if (tmpErr) {
    return NextResponse.json(
      { error: "Temp upload failed", details: tmpErr.message },
      { status: 500 }
    );
  }

  // Prefer a signed URL (works even if bucket is private). Fallback to public URL if needed.
  let tmpUrl: string | null = null;
  const { data: signed, error: signedErr } = await supabase.storage
    .from("user-images")
    .createSignedUrl(tmpPath, 60 * 10); // 10 minutes
  if (!signedErr && signed?.signedUrl) {
    tmpUrl = signed.signedUrl;
  } else {
    const { data: tmpUrlData } = supabase.storage
      .from("user-images")
      .getPublicUrl(tmpPath);
    tmpUrl = tmpUrlData.publicUrl;
  }
  if (!tmpUrl) {
    return NextResponse.json(
      { error: "Failed to generate URL for uploaded file" },
      { status: 500 }
    );
  }

  // 2) CALL FAL to remove background (blocking: simplest path)
  try {
    const result = await fal.subscribe("smoretalk-ai/rembg-enhance", {
      input: {
        image_url: tmpUrl, // ← Fal expects a URL for this model
      },
      logs: true,
      onQueueUpdate: (u) => {
        if (u.status === "IN_PROGRESS") {
          u.logs?.forEach((l) => console.log("[Fal]", l.message));
        }
      },
    });

    // Normalize Fal output → include nested image.url shape seen in tests
    const outUrl =
      (result?.data as any)?.image?.url ||
      (result?.data as any)?.url ||
      (Array.isArray((result?.data as any)?.images)
        ? (result?.data as any).images[0]?.url
        : undefined);

    let processedArrayBuffer: ArrayBuffer;
    if (outUrl) {
      // fetch the processed image bytes from Fal URL
      const r = await fetch(outUrl);
      if (!r.ok)
        throw new Error(`Failed to fetch processed image: ${r.status}`);
      processedArrayBuffer = await r.arrayBuffer();
    } else if (result?.data?.image) {
      // base64 fallback
      const maybeImage = result.data.image as unknown;
      if (typeof maybeImage === "string") {
        const buf = Buffer.from(maybeImage, "base64");
        processedArrayBuffer = buf.buffer.slice(
          buf.byteOffset,
          buf.byteOffset + buf.byteLength
        );
      } else if (
        maybeImage &&
        typeof maybeImage === "object" &&
        (maybeImage as any).url
      ) {
        const r = await fetch((maybeImage as any).url);
        if (!r.ok)
          throw new Error(`Failed to fetch processed image: ${r.status}`);
        processedArrayBuffer = await r.arrayBuffer();
      } else {
        throw new Error("Unexpected Fal image payload");
      }
    } else {
      throw new Error("Unexpected Fal response shape");
    }

    // 3) Optimize and upload processed image
    // Convert to bytes and sanity check
    const processedBytes = new Uint8Array(processedArrayBuffer);
    if (processedBytes.byteLength === 0) {
      return NextResponse.json(
        {
          error: "Fal returned an empty image",
          details: "processedBytes length is 0",
        },
        { status: 502 }
      );
    }

    // Optimize: limit max dimension and encode to PNG (alpha preserved)
    let outputBuffer: Buffer = Buffer.from(processedBytes);
    let finalMime = "image/png";
    let finalExt = "png";
    try {
      const TARGET_MAX_BYTES = 8 * 1024 * 1024; // 8MB safety target
      const sizes = [2000, 1600, 1200, 1000, 800];
      let optimized: Buffer | null = null;
      for (const dim of sizes) {
        const buf = await sharp(outputBuffer)
          .rotate()
          .resize({
            width: dim,
            height: dim,
            fit: "inside",
            withoutEnlargement: true,
          })
          .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true })
          .toBuffer();
        if (buf.byteLength <= TARGET_MAX_BYTES) {
          optimized = buf;
          break;
        }
      }
      outputBuffer =
        optimized ??
        (await sharp(outputBuffer)
          .rotate()
          .resize({
            width: 700,
            height: 700,
            fit: "inside",
            withoutEnlargement: true,
          })
          .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true })
          .toBuffer());
    } catch (err) {
      // If sharp fails for any reason, fall back to original PNG bytes
      outputBuffer = Buffer.from(processedBytes);
    }

    const finalName = `user_${userId}_${Date.now()}_${randomUUID()}_bgremoved.${finalExt}`;
    const finalPath = `${userId}/${finalName}`;
    const processedBlob = new Blob([outputBuffer], { type: finalMime });
    let uploadErr: any = null;
    {
      const { error } = await supabase.storage
        .from("user-images")
        .upload(finalPath, processedBlob, {
          contentType: finalMime,
          upsert: false,
        });
      uploadErr = error;
    }
    // If a rare name collision happens, retry once with a new name
    if (
      uploadErr &&
      String(uploadErr.message).toLowerCase().includes("exists")
    ) {
      const retryName = `user_${userId}_${Date.now()}_${randomUUID()}_bgremoved.${finalExt}`;
      const retryPath = `${userId}/${retryName}`;
      const { error: retryErr } = await supabase.storage
        .from("user-images")
        .upload(retryPath, processedBlob, {
          contentType: finalMime,
          upsert: false,
        });
      if (retryErr) {
        return NextResponse.json(
          { error: "Upload processed failed", details: retryErr.message },
          { status: 500 }
        );
      }
      // Overwrite final path/name to the successful retry
      const { data: publicUrlData } = supabase.storage
        .from("user-images")
        .getPublicUrl(retryPath);
      const imageUrl = publicUrlData.publicUrl;
      const insertedId = await insertUserImage(
        userId,
        retryName,
        imageUrl,
        parseInt(categoryId, 10)
      );
      if (!insertedId) {
        return NextResponse.json(
          { error: "Database insert failed" },
          { status: 500 }
        );
      }
      await supabase.storage
        .from("user-images")
        .remove([tmpPath])
        .catch(() => {});
      return NextResponse.json({ imageUrl, id: insertedId }, { status: 200 });
    }

    if (uploadErr) {
      return NextResponse.json(
        { error: "Upload processed failed", details: uploadErr.message },
        { status: 500 }
      );
    }

    // Get public URL for the processed file
    const { data: publicUrlData } = supabase.storage
      .from("user-images")
      .getPublicUrl(finalPath);
    const imageUrl = publicUrlData.publicUrl;

    // 4) Insert DB record (processed image only)
    const insertedId = await insertUserImage(
      userId,
      finalName,
      imageUrl,
      parseInt(categoryId, 10)
    );
    if (!insertedId) {
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    // 5) (Optional) Clean up temp original
    await supabase.storage
      .from("user-images")
      .remove([tmpPath])
      .catch(() => {});

    return NextResponse.json({ imageUrl, id: insertedId }, { status: 200 });
  } catch (e: any) {
    // If Fal fails, return an error (no DB insert, no final upload)
    return NextResponse.json(
      { error: "Fal background removal failed", details: String(e) },
      { status: 502 }
    );
  }
}
