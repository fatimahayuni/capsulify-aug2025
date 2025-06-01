import pool from './db'

export interface ClothingVariantData {
	  id: number;
    image_file_name: string;
    name: string;
    top_sleeve_type_id: number | null;
    blouse_sleeve_type_id: number | null;
    neckline_id: number | null;
    dress_cut_id: number | null;
    bottom_cut_id: number | null;
    short_cut_id: number | null;
    skirt_cut_id: number | null;
    subcategory_id: number;
    colour_type_id: number;
    category_id: number;
    info_text_id: string;
}

export const getClothingVariantsDB = async (): Promise<ClothingVariantData[]> => {
    const client = await pool.connect();

  try {
    await client.query("SET search_path TO capsulify_live");

    // Get all clothing variants with their subcategory information
    const getAllVariantsQuery = `
      SELECT cv.id,
            cv.image_file_name,
            cv.name,
            cv.top_sleeve_type_id,
            cv.blouse_sleeve_type_id,
            cv.neckline_id,
            cv.dress_cut_id,
            cv.bottom_cut_id,
            cv.short_cut_id,
            cv.skirt_cut_id,
            ci.subcategory_id,
            ci.colour_type_id,
            ci.category_id,
            cv.info_text_id
      FROM
        clothing_variants cv
      JOIN clothing_items ci ON cv.clothing_item_id = ci.id
      ORDER BY ci.subcategory_id
    `;

    const variants = await client.query(getAllVariantsQuery);

    return variants.rows;
  } catch (error) {
    console.error("Error getting all clothing variants:", error);
    throw new Error("Failed to get all clothing variants");
  } finally {
    client.release();
  }
}