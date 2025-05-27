'use server'

import { CreateUserParams, OnboardingData } from '@/app/types'
import pool from '../database/db'
import { MONTHLY_OCCASIONS, BODY_TYPE_ID } from '@/app/constants'
import { DEFAULT_WARDROBE } from '@/app/constants/utils'



// Helper function to convert string values to enum IDs (kept for backward compatibility with updateUserBodyType)
const getBodyTypeIdByName = (name: string): number => {
	const bodyTypeEntries = Object.entries(BODY_TYPE_ID)
	for (const [id, bodyTypeName] of bodyTypeEntries) {
		if (bodyTypeName === name) {
			return parseInt(id)
		}
	}
	throw new Error(`Body type '${name}' not found`)
}

const getOccasionIdByKey = (key: string): number => {
	const occasion = MONTHLY_OCCASIONS.find(item => item.key === key)
	if (!occasion) {
		throw new Error(`Occasion '${key}' not found`)
	}
	return occasion.id
}

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

		// Get body type ID using enum helper function
		const bodyTypeId = getBodyTypeIdByName(bodyType)

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

export const saveOnboardingData = async (
	onboardingData: OnboardingData,
	clerkId: string
) => {
	const {
		ageGroupId,
		location,
		bodyTypeId,
		heightId,
		favoritePartIds,
		leastFavoritePartIds,
		personalStyleId,
		occasions,
		goal,
		frustration,
	} = onboardingData
	
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')
		await client.query('BEGIN')

		// Reference IDs are already provided as enum IDs
		const referenceIds = {
			ageGroupId,
			bodyTypeId,
			heightId,
			personalStyleId,
		}

		// Update user with all main fields
		const dbUserId = await updateUserMainFields(client, {
			referenceIds,
			location,
			goal,
			frustration,
			clerkId,
		})

		// Insert user preferences
		await insertUserPreferences(client, {
			dbUserId,
			favoritePartIds,
			leastFavoritePartIds,
			occasions,
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



// Helper function to update user main fields
const updateUserMainFields = async (
	client: any,
	params: {
		referenceIds: {
			ageGroupId: number
			bodyTypeId: number
			heightId: number
			personalStyleId: number
		}
		location: string
		goal: string
		frustration: string
		clerkId: string
	}
) => {
	const { referenceIds, location, goal, frustration, clerkId } = params
	
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
		referenceIds.ageGroupId,
		location,
		referenceIds.bodyTypeId,
		referenceIds.heightId,
		referenceIds.personalStyleId,
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
		favoritePartIds: number[]
		leastFavoritePartIds: number[]
		occasions: Record<string, number>
	}
) => {
	const { dbUserId, favoritePartIds, leastFavoritePartIds, occasions } = params

	// Batch insert favorite parts
	if (favoritePartIds.length > 0) {
		const favoritePartsValues = favoritePartIds.map((partId, index) => 
			`($1, $${index + 2})`
		).join(', ')
		
		const insertFavoritePartsQuery = `
			INSERT INTO user_fav_parts (user_id, fav_part_id) 
			VALUES ${favoritePartsValues}
		`
		
		const favoritePartsParams = [dbUserId, ...favoritePartIds]
		
		await client.query(insertFavoritePartsQuery, favoritePartsParams)
	}

	// Batch insert least favorite parts
	if (leastFavoritePartIds.length > 0) {
		const leastFavoritePartsValues = leastFavoritePartIds.map((partId, index) => 
			`($1, $${index + 2})`
		).join(', ')
		
		const insertLeastFavoritePartsQuery = `
			INSERT INTO user_least_fav_parts (user_id, least_fav_part_id) 
			VALUES ${leastFavoritePartsValues}
		`
		
		const leastFavoritePartsParams = [dbUserId, ...leastFavoritePartIds]
		
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
			const occasionId = getOccasionIdByKey(key)
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
