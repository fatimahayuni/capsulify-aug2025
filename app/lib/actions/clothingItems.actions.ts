"use server";

import { ClothingVariantData, getClothingVariantsDB } from "../database/clothing";
import pool from "../database/db";
import { getUserId } from "../database/getUserId";
import { getUserClothingVariants as getUserClothingVariantsDB, UserClothingVariantData } from "../database/userdata";

export const getUserClothingVariants = async (): Promise<UserClothingVariantData[]> => {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const clothingVariants = await getUserClothingVariantsDB();
    if (!clothingVariants) {
      throw new Error("No clothing variants found");
    }
    return clothingVariants;
  } catch (error) {
    console.error("Error getting user wardrobe:", error);
    throw new Error("Failed to get user wardrobe");
  }
};

export const getClothingVariantId = async (options: any) => {
  const client = await pool.connect();

  try {
    await client.query("SET search_path TO capsulify_live");

    // colour_type_id is in clothing_items table and rest are in clothing_variants table
    const getClothingVariantIdQuery = `
  SELECT cv.id, cv.image_file_name, cv.name
  FROM clothing_variants cv
  JOIN clothing_items ci ON cv.clothing_item_id = ci.id
  WHERE ($1::int IS NULL OR cv.top_sleeve_type_id = $1::int)
    AND ($2::int IS NULL OR cv.blouse_sleeve_type_id = $2::int)
    AND ($3::int IS NULL OR cv.neckline_id = $3::int)
    AND ($4::int IS NULL OR cv.dress_cut_id = $4::int)
    AND ($5::int IS NULL OR cv.bottom_cut_id = $5::int)
    AND ($6::int IS NULL OR cv.short_cut_id = $6::int)
    AND ($7::int IS NULL OR cv.skirt_cut_id = $7::int)
    AND ($8::int IS NULL OR ci.colour_type_id = $8::int)
`;

    const clothingVariantId = await client.query(getClothingVariantIdQuery, [
      options.top_sleeve_type_id,
      options.blouse_sleeve_type_id,
      options.neckline_id,
      options.dress_cut_id,
      options.bottom_cut_id,
      options.short_cut_id,
      options.skirt_cut_id,
      options.colour_type_id,
    ]);
    console.log(
      "Clothing variant ID retrieved successfully:",
      clothingVariantId.rows[0]
    );

    return clothingVariantId.rows[0];
  } catch (error) {
    console.error("Error getting clothing variant ID:", error);
    throw new Error("Failed to get clothing variant ID");
  } finally {
    client.release();
  }
};

export const saveClothingVariantId = async (
  user_id: number,
  clothing_variant_id: number,
  prev_clothing_variant_id: number
) => {
  const client = await pool.connect();

  try {
    await client.query("SET search_path TO capsulify_live");

    const saveClothingVariantIdQuery = `
      UPDATE user_clothing_variants
      SET clothing_variant_id = $1
      WHERE user_id = $2 AND clothing_variant_id = $3
	`;

    const result = await client.query(saveClothingVariantIdQuery, [
      clothing_variant_id,
      user_id,
      prev_clothing_variant_id,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error saving clothing variant ID:", error);
    throw new Error("Failed to save clothing variant ID");
  } finally {
    client.release();
  }
};

export const getAllClothingVariants = async (): Promise<ClothingVariantData[]> => {
  try {
    const variants = await getClothingVariantsDB();
    return variants;
  } catch (error) {
    console.error("Error getting all clothing variants:", error);
    throw new Error("Failed to get all clothing variants");
  }
};
