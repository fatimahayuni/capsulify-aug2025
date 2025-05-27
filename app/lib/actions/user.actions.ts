'use server'

import { CreateUserParams, OnboardingData } from '@/app/types'
import pool from '../database/db'
import { getUserWardrobe } from './clothingItems.actions'
import { MONTHLY_OCCASIONS } from '@/app/constants'
import { DEFAULT_WARDROBE } from '@/app/constants/utils'

export const createUser = async (params: CreateUserParams) => {
	const client = await pool.connect()

	try {
		await client.query('SET search_path TO capsulify_live')

		const { name, username, email, clerkId } = params

		const createUserQuery = `
      INSERT INTO users (name, username, email, clerk_id)
      VALUES ($1, $2, $3, $4)
    `

		const result = await client.query(createUserQuery, [
			name,
			username,
			email,
			clerkId,
		])
	} catch (error) {
		console.error('Error creating user:', error)
		throw new Error('Failed to create user')
	} finally {
		client.release()
	}
}

export const getUserByClerkId = async (clerkId: string) => {
	let client
	try {
		client = await pool.connect()

		await client.query('SET search_path TO capsulify_live')

		console.log('clerk id', clerkId)

		const getUserQuery = `
      SELECT * FROM users
      WHERE clerk_id = $1
    `

		const user = await client.query(getUserQuery, [clerkId])

		console.log('User retrieved successfully:', user.rows[0])

		return user.rows[0]
	} catch (error) {
		console.error('Error getting user by clerkId:', error)
		throw new Error('Failed to get user')
	} finally {
		if (client) {
			client.release()
		}
	}
}

export const updateUserBodyType = async (bodyType: string, clerkId: string) => {
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')
		
		// Begin transaction
		await client.query('BEGIN')

		const bodyTypeQuery = `SELECT id FROM body_shapes WHERE name = $1`
		const bodyTypeResult = await client.query(bodyTypeQuery, [bodyType])

		if (bodyTypeResult.rows.length === 0)
			throw new Error('body type not found')

		const bodyTypeId = bodyTypeResult.rows[0].id

		const updateUserQuery = `
      UPDATE users SET body_shape_id = $1, onboarded = true WHERE clerk_id = $2 RETURNING id
    `

		const result = await client.query(updateUserQuery, [
			bodyTypeId,
			clerkId,
		])
		
		// Create user wardrobe
		const defaultItems = DEFAULT_WARDROBE.INVERTED_TRIANGLE
		const createWardrobeQuery = `
			INSERT INTO user_clothing_variants (user_id, clothing_variant_id)
			SELECT $1, UNNEST($2::int[])
		`
		await client.query(createWardrobeQuery, [result.rows[0].id, defaultItems])
		
		// Commit transaction
		await client.query('COMMIT')
		
		console.log('User updated successfully:', result.rows[0])
		return result.rows[0].id
	} catch (error) {
		// Rollback transaction on error
		try {
			await client.query('ROLLBACK')
		} catch (rollbackError) {
			console.error('Error rolling back transaction:', rollbackError)
		}
		console.error('Error updating user body type:', error)
		throw new Error('Failed to update user body type')
	} finally {
		client.release()
	}
}

export const updateUser = async (params: CreateUserParams) => {
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')
		const { name, username, email, clerkId } = params

		const updateUserQuery = `
      UPDATE users
      SET name = $1, username = $2, email = $3
      WHERE clerk_id = $4
    `
		const result = await client.query(updateUserQuery, [
			name,
			username,
			email,
			clerkId,
		])

		console.log('User updated successfully:', result)
		client.release()
	} catch (error) {
		console.error('Error updating user:', error)
		throw new Error('Failed to update user')
	}
}

export const deleteUser = async (clerkId: string) => {
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')

		const deleteUserQuery = `
      DELETE FROM capsulify_live.users
      WHERE clerk_id = $1
    `

		const result = await client.query(deleteUserQuery, [clerkId])

		console.log('User deleted successfully:', result)
		client.release()
	} catch (error) {
		console.error('Error deleting user:', error)
		throw new Error('Failed to delete user')
	}
}

export const updateUserDetails = async (
	onboardingData: OnboardingData,
	clerkId: string
) => {
	const {
		ageGroup,
		location,
		bodyType,
		height,
		favoriteParts,
		leastFavoriteParts,
		personalStyle,
		occasions,
		goal,
		frustration,
	} = onboardingData
	
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')
		await client.query('BEGIN')

		// Lookup all reference IDs
		const lookupMap = await lookupReferenceIds(client, {
			ageGroup,
			bodyType,
			height,
			personalStyle,
		})

		// Get body part IDs
		const bodyPartIds = await lookupBodyPartIds(client, [
			...favoriteParts,
			...leastFavoriteParts,
		])

		// Update user with all main fields
		const dbUserId = await updateUserMainFields(client, {
			lookupMap,
			location,
			goal,
			frustration,
			clerkId,
		})

		// Insert user preferences
		await insertUserPreferences(client, {
			dbUserId,
			favoriteParts,
			leastFavoriteParts,
			occasions,
			bodyPartIds,
		})

		// Create user wardrobe
		await insertUserWardrobe(client, dbUserId)

		await client.query('COMMIT')
		console.log('User details updated successfully')
		return dbUserId
	} catch (error) {
		await handleTransactionError(client, error)
		throw new Error('Failed to update user details')
	} finally {
		client.release()
	}
}

// Helper function to lookup reference IDs for age group, body shape, height, and personal style
const lookupReferenceIds = async (
	client: any,
	params: {
		ageGroup: string
		bodyType: string
		height: string
		personalStyle: string
	}
) => {
	const { ageGroup, bodyType, height, personalStyle } = params
	
	const lookupQuery = `
		SELECT 
			'age_group' as type, ag.id, ag.name
		FROM age_group ag WHERE ag.name = $1
		UNION ALL
		SELECT 
			'body_shape' as type, bs.id, bs.name
		FROM body_shapes bs WHERE bs.name = $2
		UNION ALL
		SELECT 
			'height' as type, h.id, h.name
		FROM height h WHERE h.name = $3
		UNION ALL
		SELECT 
			'personal_style' as type, ps.id, ps.name
		FROM personal_style ps WHERE ps.name = $4
	`
	
	const lookupResult = await client.query(lookupQuery, [
		ageGroup,
		bodyType,
		height,
		personalStyle,
	])

	// Process lookup results
	const lookupMap = new Map()
	lookupResult.rows.forEach((row: any) => {
		lookupMap.set(row.type, row.id)
	})

	// Validate all required IDs were found
	const requiredTypes = ['age_group', 'body_shape', 'height', 'personal_style']
	for (const type of requiredTypes) {
		if (!lookupMap.has(type)) {
			throw new Error(`${type.replace('_', ' ')} not found`)
		}
	}

	return lookupMap
}

// Helper function to lookup body part IDs
const lookupBodyPartIds = async (client: any, bodyParts: string[]) => {
	const bodyPartIds = new Map()
	
	if (bodyParts.length > 0) {
		const bodyPartsQuery = `
			SELECT id, name FROM body_parts 
			WHERE name = ANY($1)
		`
		const bodyPartsResult = await client.query(bodyPartsQuery, [bodyParts])
		bodyPartsResult.rows.forEach((row: any) => {
			bodyPartIds.set(row.name, row.id)
		})

		// Validate all body parts were found
		for (const part of bodyParts) {
			if (!bodyPartIds.has(part)) {
				throw new Error(`Body part '${part}' not found`)
			}
		}
	}

	return bodyPartIds
}

// Helper function to update user main fields
const updateUserMainFields = async (
	client: any,
	params: {
		lookupMap: Map<string, number>
		location: string
		goal: string
		frustration: string
		clerkId: string
	}
) => {
	const { lookupMap, location, goal, frustration, clerkId } = params
	
	const updateUserQuery = `
		UPDATE users SET 
			age_group_id = $1,
			location = $2,
			body_shape_id = $3,
			height_id = $4,
			personal_style_id = $5,
			goal = $6,
			frustration = $7,
			onboarded = true
		WHERE clerk_id = $8
		RETURNING id
	`

	const updateResult = await client.query(updateUserQuery, [
		lookupMap.get('age_group'),
		location,
		lookupMap.get('body_shape'),
		lookupMap.get('height'),
		lookupMap.get('personal_style'),
		goal,
		frustration,
		clerkId,
	])

	if (updateResult.rows.length === 0) {
		throw new Error('User not found')
	}

	return updateResult.rows[0].id
}

// Helper function to insert user preferences (favorite parts, least favorite parts, occasions)
const insertUserPreferences = async (
	client: any,
	params: {
		dbUserId: number
		favoriteParts: string[]
		leastFavoriteParts: string[]
		occasions: Record<string, number>
		bodyPartIds: Map<string, number>
	}
) => {
	const { dbUserId, favoriteParts, leastFavoriteParts, occasions, bodyPartIds } = params

	// Batch insert favorite parts
	if (favoriteParts.length > 0) {
		const favoritePartsValues = favoriteParts.map((part, index) => 
			`($1, $${index + 2})`
		).join(', ')
		
		const insertFavoritePartsQuery = `
			INSERT INTO user_fav_parts (user_id, fav_part_id) 
			VALUES ${favoritePartsValues}
		`
		
		const favoritePartsParams = [
			dbUserId,
			...favoriteParts.map(part => bodyPartIds.get(part))
		]
		
		await client.query(insertFavoritePartsQuery, favoritePartsParams)
	}

	// Batch insert least favorite parts
	if (leastFavoriteParts.length > 0) {
		const leastFavoritePartsValues = leastFavoriteParts.map((part, index) => 
			`($1, $${index + 2})`
		).join(', ')
		
		const insertLeastFavoritePartsQuery = `
			INSERT INTO user_least_fav_parts (user_id, least_fav_part_id) 
			VALUES ${leastFavoritePartsValues}
		`
		
		const leastFavoritePartsParams = [
			dbUserId,
			...leastFavoriteParts.map(part => bodyPartIds.get(part))
		]
		
		await client.query(insertLeastFavoritePartsQuery, leastFavoritePartsParams)
	}

	// Batch insert monthly occasions
	const occasionEntries = Object.entries(occasions).filter(([key, value]) => value > 0)
	if (occasionEntries.length > 0) {
		const occasionValues = occasionEntries.map((entry, index) => {
			const baseIndex = index * 3
			return `($1, $${baseIndex + 2}, $${baseIndex + 3})`
		}).join(', ')
		
		const insertOccasionsQuery = `
			INSERT INTO user_monthly_occasions (user_id, occasions_id, occurence_count) 
			VALUES ${occasionValues}
		`
		
		const occasionParams = [dbUserId]
		occasionEntries.forEach(([key, value]) => {
			const occasionId = MONTHLY_OCCASIONS.find(item => item.key === key)?.id
			if (!occasionId) {
				throw new Error(`Occasion '${key}' not found`)
			}
			occasionParams.push(occasionId, value)
		})
		
		await client.query(insertOccasionsQuery, occasionParams)
	}
}

// Helper function to insert user wardrobe
const insertUserWardrobe = async (client: any, dbUserId: number) => {
	const defaultItems = DEFAULT_WARDROBE.INVERTED_TRIANGLE
	const createWardrobeQuery = `
		INSERT INTO user_clothing_variants (user_id, clothing_variant_id)
		SELECT $1, UNNEST($2::int[])
	`
	await client.query(createWardrobeQuery, [dbUserId, defaultItems])
}

// Helper function to handle transaction errors
const handleTransactionError = async (client: any, error: any) => {
	try {
		await client.query('ROLLBACK')
	} catch (rollbackError) {
		console.error('Error rolling back transaction:', rollbackError)
	}
	console.error('Error updating user details:', error)
}
