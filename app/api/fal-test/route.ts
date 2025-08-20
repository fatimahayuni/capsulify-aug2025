import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

// Optional: force this to run on the server each request
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing FAL_KEY env var" },
        { status: 500 }
      );
    }
    fal.config({ credentials: process.env.FAL_KEY });

    // allow ?url=... override, else use Fal's sample image
    const { searchParams } = new URL(req.url);
    const imageUrl =
      searchParams.get("url") ??
      "https://fal.media/files/kangaroo/SOF3bLF7b1kJ2-N9dTg-c.png";

    // This model is from your snippet; if you pick a different one, change the name.
    const result = await fal.subscribe("smoretalk-ai/rembg-enhance", {
      input: { image_url: imageUrl },
      logs: true,
      onQueueUpdate: (u) => {
        if (u.status === "IN_PROGRESS") {
          // You can see these logs in your Next.js server console
          u.logs?.map((l) => l.message).forEach(console.log);
        }
      },
    });

    // Return whatever Fal gives us so you can inspect it
    return NextResponse.json(
      {
        ok: true,
        requestId: result.requestId,
        data: result.data, // often contains an output url/base64 depending on model
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
