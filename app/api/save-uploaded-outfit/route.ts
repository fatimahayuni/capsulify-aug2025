import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/app/lib/database/getUserId";
import { createClient } from "@/app/lib/supabase/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { outfitKey } = await req.json();
    if (!outfitKey) {
      return NextResponse.json({ error: "Missing outfitKey" }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("user_saved_uploaded_outfits")
      .insert({
        user_id: userId,
        outfit_key: outfitKey,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error saving uploaded outfit:", error);
      return NextResponse.json(
        { error: "Failed to save outfit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save uploaded outfit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { outfitKey } = await req.json();
    if (!outfitKey) {
      return NextResponse.json({ error: "Missing outfitKey" }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("user_saved_uploaded_outfits")
      .delete()
      .eq("user_id", userId)
      .eq("outfit_key", outfitKey);

    if (error) {
      console.error("Error deleting uploaded outfit:", error);
      return NextResponse.json(
        { error: "Failed to delete outfit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete uploaded outfit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_saved_uploaded_outfits")
      .select("outfit_key")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching saved uploaded outfits:", error);
      return NextResponse.json(
        { error: "Failed to fetch outfits" },
        { status: 500 }
      );
    }

    const outfitKeys = data?.map((row) => row.outfit_key) || [];
    return NextResponse.json({ outfitKeys });
  } catch (error) {
    console.error("Fetch saved uploaded outfits error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
