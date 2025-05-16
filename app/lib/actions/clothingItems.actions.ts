'use server'

import { DEFAULT_WARDROBE } from '@/app/constants/utils'
import pool from '../database/db'
import { getUserId } from '../database/getUserId'

export const createUserWardrobe = async (userId: number, bodyType?: string) => {
	const client = await pool.connect()

	try {
		await client.query('SET search_path TO capsulify_live')
		const defaultItems = DEFAULT_WARDROBE.INVERTED_TRIANGLE
		const createWardrobeQuery = `
    INSERT INTO user_clothing_variants (user_id, clothing_variant_id)
    SELECT $1, $2`
		for (const item of defaultItems) {
			await client.query(createWardrobeQuery, [userId, item])
		}
		console.log('User wardrobe created successfully')
	} catch (error) {
		console.error('Error creating user wardrobe:', error)
		throw new Error('Failed to create user wardrobe')
	} finally {
		client.release()
	}
}

export const getUserWardrobe = async (clerkId: string) => {
	const userId = await getUserId()
	if (!userId) {
		throw new Error('User not found')
	}
	
	const client = await pool.connect()

	try {
		await client.query('SET search_path TO capsulify_live')

		const getWardrobeQuery = `
        SELECT 
        ucv.id AS id,
        ci.category_id,
        ci.subcategory_id,
        cv.image_file_name
        FROM user_clothing_variants ucv
        JOIN clothing_variants cv ON ucv.clothing_variant_id = cv.id
        JOIN clothing_items ci ON cv.clothing_item_id = ci.id
        WHERE ucv.user_id = $1
        `

		const wardrobe = await client.query(getWardrobeQuery, [userId])
		const clothingVariantIds = wardrobe.rows.map(
			(item) => item.clothing_variant_id
		)

		// SEGREGATE CLOTHING VARIANTS BY CATEGORY
		const segregatedWardrobe = wardrobe.rows.reduce((acc, item) => {
			const categoryId = item.category_id
			if (!acc[categoryId]) {
				acc[categoryId] = []
			}
			acc[categoryId].push(item)
			return acc
		}, {})
		console.log('User wardrobe retrieved successfully:', segregatedWardrobe)

		return segregatedWardrobe
	} catch (error) {
		console.error('Error getting user wardrobe:', error)
		throw new Error('Failed to get user wardrobe')
	} finally {
		client.release()
	}
}

// TODO: Move this to middleware to make it available to every HTTP request.
async function getUserIdByClerkId(clerkId: string) {
	const client = await pool.connect()

	try {
		await client.query('SET search_path TO capsulify_live')
		const getUserIdQuery = `
			SELECT id FROM users WHERE clerk_id = $1
		`
		const userId = await client.query(getUserIdQuery, [clerkId])
		return Number(userId.rows[0].id)
	} catch (error) {
		console.error('Error getting user ID by clerk ID:', error)
		throw new Error('Failed to get user ID by clerk ID')
	} finally {
		client.release()
	}
}
