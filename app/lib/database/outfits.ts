import { auth } from "@clerk/nextjs/server";
import pool from "./db";
import { getUserId } from "./getUserId";

interface OutfitClothingItemData {
    clothing_variant_id: number;
    category_id: number;
    subcategory_id: number;
    image_file_name: string;
}

// getUserClothingItems returns all the clothing items for a user to be used in outfit generation.
export async function getUserClothingItems(): Promise<OutfitClothingItemData[] | null> {

  const userId = await getUserId();
  if (!userId) {
    return null;
  }

  const client = await pool.connect();

  try {
    await client.query("SET search_path TO capsulify_live");

    const getClothingItemsQuery = `
        SELECT 
          cv.id AS clothing_variant_id,
          ci.category_id,
          ci.subcategory_id,
          cv.image_file_name
        FROM user_clothing_variants ucv
        JOIN clothing_variants cv ON ucv.clothing_variant_id = cv.id
        JOIN clothing_items ci ON cv.clothing_item_id = ci.id
        WHERE ucv.user_id = $1
        ORDER BY ucv.id
        `;

    const items = await client.query(getClothingItemsQuery, [userId]);
    return items.rows;
  } catch (error) {
    console.error("Error in getUserClothingItems:", error);
    return null;
  } finally {
    client.release();
  }
}
