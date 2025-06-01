'use server'

import pool from './db'
import { getUserId } from './getUserId'

export interface OutfitFavourite {
	top_variant_id: number | null;
	bottom_variant_id: number | null;
	dress_variant_id: number | null;
	layer_variant_id: number | null;
	bag_variant_id: number | null;
	shoe_variant_id: number | null;
}

// saveOutfitFavourite saves an outfit to the user's favourites.
export async function saveOutfitFavourite(outfit: OutfitFavourite): Promise<string | null> {
	const userId = await getUserId()
	if (!userId) {
		return null
	}

	const client = await pool.connect()

	try {
		await client.query('SET search_path TO capsulify_live')

        // Check if the outfit already exists.
        const checkExistingQuery = `
            SELECT id FROM user_saved_outfits 
            WHERE user_id = $1 AND outfit_key = $2
        `
        const outfitKey = generateOutfitKey(outfit)

        const existingOutfit = await client.query(checkExistingQuery, [userId, outfitKey])
        
        if (existingOutfit.rows.length > 0) {
            return existingOutfit.rows[0].id
        }

        // Save the outfit.
        const saveOutfitQuery = `
            INSERT INTO user_saved_outfits (
                user_id,
                top_variant_id,
                bottom_variant_id,
                dress_variant_id,
                layer_variant_id,
                bag_variant_id,
                shoe_variant_id,
                outfit_key
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `

        const values = [
            userId,
            outfit.top_variant_id,
            outfit.bottom_variant_id,
            outfit.dress_variant_id,
            outfit.layer_variant_id,
            outfit.bag_variant_id,
            outfit.shoe_variant_id,
            outfitKey
        ]

        await client.query(saveOutfitQuery, values)
        return outfitKey
	} catch (error) {
		console.error('Error in saveOutfitFavourite:', error)
		return null
	} finally {
		client.release()
	}
}

// deleteOutfitFavourite deletes an outfit from the user's favourites.
export async function deleteOutfitFavourite(outfitKey: string): Promise<void> {
    const userId = await getUserId()
    if (!userId) {
        return
    }

    const client = await pool.connect()

    try {
        await client.query('SET search_path TO capsulify_live')

        const deleteOutfitQuery = `
            DELETE FROM user_saved_outfits 
            WHERE user_id = $1 AND outfit_key = $2
        `
        await client.query(deleteOutfitQuery, [userId, outfitKey])
    } catch (error) {
        console.error('Error in deleteOutfitFavourite:', error)
    } finally {
        client.release()
    }
}

// getUserOutfitFavouriteKeys gets all the outfit keys for the user's favourites.
export async function getUserOutfitFavouriteKeys(): Promise<string[]> {
    const userId = await getUserId()
    if (!userId) {
        return []
    }

    const client = await pool.connect()

    try {
        await client.query('SET search_path TO capsulify_live')

        const getOutfitKeysQuery = `
            SELECT outfit_key FROM user_saved_outfits 
            WHERE user_id = $1
        `
        
        const result = await client.query(getOutfitKeysQuery, [userId])
        return result.rows.map((row) => row.outfit_key)
    } catch (error) {
        console.error('Error in getOutfitFavouriteKeys:', error)
        return []
    } finally {
        client.release()
    }
}

// generateOutfitKey generates a unique key for an outfit.
function generateOutfitKey(outfit: OutfitFavourite): string {
    return [
        outfit.top_variant_id ?? 0,
        outfit.bottom_variant_id ?? 0,
        outfit.dress_variant_id ?? 0,
        outfit.layer_variant_id ?? 0,
        outfit.bag_variant_id ?? 0,
        outfit.shoe_variant_id ?? 0
    ].join('-')
}
