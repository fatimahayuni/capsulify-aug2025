import pool from './db'
import { getUserId } from './getUserId'

// Types for getUserWardrobe return value
export interface UserClothingVariantData {
	id: number;
	category_id: number;
	subcategory_id: number;
	colour_type_id: number;
	name: string;
	top_sleeve_type_id: number | null;
	blouse_sleeve_type_id: number | null;
	neckline_id: number | null;
	dress_cut_id: number | null;
	bottom_cut_id: number | null;
	short_cut_id: number | null;
	skirt_cut_id: number | null;
	image_file_name: string;
	clothing_variant_id: number;
	info_text_id: string;
  }

// getUserClothingVariants returns all the clothing variants for a user to be used in outfit generation.
export async function getUserClothingVariants(): Promise<
	UserClothingVariantData[] | null
> {
	const userId = await getUserId()
	if (!userId) {
		return null
	}

	const client = await pool.connect()

	try {
		await client.query('SET search_path TO capsulify_live')

		const getClothingItemsQuery = `
        SELECT 
        ucv.id AS id,
        ci.category_id,
        ci.subcategory_id,
		    ci.colour_type_id,
        	cv.name,
		    cv.top_sleeve_type_id,
		    cv.blouse_sleeve_type_id,
		    cv.neckline_id,
		    cv.dress_cut_id,
		    cv.bottom_cut_id,
		    cv.short_cut_id,
		    cv.skirt_cut_id,
        	cv.image_file_name,
		    cv.id as clothing_variant_id,
		    cv.info_text_id
        FROM user_clothing_variants ucv
        JOIN clothing_variants cv ON ucv.clothing_variant_id = cv.id
        JOIN clothing_items ci ON cv.clothing_item_id = ci.id
        WHERE ucv.user_id = $1
        ORDER BY ucv.id
        `

		const items = await client.query(getClothingItemsQuery, [userId])
		return items.rows
	} catch (error) {
		console.error('Error in getUserClothingItems:', error)
		return null
	} finally {
		client.release()
	}
}
