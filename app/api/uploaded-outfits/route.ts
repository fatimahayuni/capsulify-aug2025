import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/app/lib/database/getUserId";
import { supabase } from "@/app/lib/supabase/client";

export const runtime = "nodejs";

type UserImage = {
  id: number;
  image_name: string;
  image_url: string;
  category_id: number;
};

type UploadedOutfit = {
  grouptype_id: number;
  items: Array<{ id: number; category_id: number; image_url: string }>;
};

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch user images grouped by category
    const { data: images, error } = await supabase
      .from("user_images")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user images:", error);
      return NextResponse.json(
        { error: "Failed to fetch user images" },
        { status: 500 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ outfits: [] });
    }

    // Group images by category
    const imagesByCategory: Record<number, UserImage[]> = {};
    images.forEach((image) => {
      if (!imagesByCategory[image.category_id]) {
        imagesByCategory[image.category_id] = [];
      }
      imagesByCategory[image.category_id].push(image);
    });

    const outfits: UploadedOutfit[] = [];

    // Generate outfit combinations based on available categories
    // Group 1: Top + Bottom + Layer + Bag + Shoes
    if (
      imagesByCategory[1] && // Tops
      imagesByCategory[2] && // Bottoms
      imagesByCategory[4] && // Layers
      imagesByCategory[5] && // Bags
      imagesByCategory[6]    // Shoes
    ) {
      imagesByCategory[1].forEach((top) => {
        imagesByCategory[2].forEach((bottom) => {
          imagesByCategory[4].forEach((layer) => {
            imagesByCategory[5].forEach((bag) => {
              imagesByCategory[6].forEach((shoe) => {
                outfits.push({
                  grouptype_id: 1,
                  items: [top, bottom, layer, bag, shoe],
                });
              });
            });
          });
        });
      });
    }

    // Group 2: Dress + Layer + Bag + Shoes
    if (
      imagesByCategory[3] && // Dresses
      imagesByCategory[4] && // Layers
      imagesByCategory[5] && // Bags
      imagesByCategory[6]    // Shoes
    ) {
      imagesByCategory[3].forEach((dress) => {
        imagesByCategory[4].forEach((layer) => {
          imagesByCategory[5].forEach((bag) => {
            imagesByCategory[6].forEach((shoe) => {
              outfits.push({
                grouptype_id: 2,
                items: [dress, layer, bag, shoe],
              });
            });
          });
        });
      });
    }

    // Group 3: Top + Bottom + Bag + Shoes
    if (
      imagesByCategory[1] && // Tops
      imagesByCategory[2] && // Bottoms
      imagesByCategory[5] && // Bags
      imagesByCategory[6]    // Shoes
    ) {
      imagesByCategory[1].forEach((top) => {
        imagesByCategory[2].forEach((bottom) => {
          imagesByCategory[5].forEach((bag) => {
            imagesByCategory[6].forEach((shoe) => {
              outfits.push({
                grouptype_id: 3,
                items: [top, bottom, bag, shoe],
              });
            });
          });
        });
      });
    }

    // Group 4: Dress + Bag + Shoes
    if (
      imagesByCategory[3] && // Dresses
      imagesByCategory[5] && // Bags
      imagesByCategory[6]    // Shoes
    ) {
      imagesByCategory[3].forEach((dress) => {
        imagesByCategory[5].forEach((bag) => {
          imagesByCategory[6].forEach((shoe) => {
            outfits.push({
              grouptype_id: 4,
              items: [dress, bag, shoe],
            });
          });
        });
      });
    }

    return NextResponse.json({ outfits });
  } catch (error) {
    console.error("Error generating uploaded outfits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
