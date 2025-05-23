'use server'

import { CreateUserParams, OnboardingData } from '@/app/types'
import pool from '../database/db'
import { createUserWardrobe, getUserWardrobe } from './clothingItems.actions'

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
		await createUserWardrobe(result.rows[0].id, bodyType)
		console.log('User updated successfully:', result.rows[0])
		return result.rows[0].id
	} catch (error) {
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

		// Update age group
		const ageGroupQuery = `SELECT id FROM age_group WHERE name = $1`
		const ageGroupResult = await client.query(ageGroupQuery, [ageGroup])
		console.log('age group result', ageGroup, ageGroupResult)

		if (ageGroupResult.rows.length === 0)
			throw new Error('age group not found')

		const ageGroupId = ageGroupResult.rows[0].id

		const updateAgeGroupQuery = `UPDATE users SET age_group_id = $1 WHERE clerk_id = $2`
		await client.query(updateAgeGroupQuery, [ageGroupId, clerkId])

		// update location
		const updateLocationQuery = `UPDATE users SET location = $1 WHERE clerk_id = $2`
		await client.query(updateLocationQuery, [location, clerkId])

		// Update body type
		const bodyTypeQuery = `SELECT id from body_shapes WHERE name = $1`
		const bodyTypeResult = await client.query(bodyTypeQuery, [bodyType])

		if (bodyTypeResult.rows.length === 0)
			throw new Error('body type not found')

		const bodyTypeId = bodyTypeResult.rows[0].id

		const updateBodyTypeQuery = `UPDATE users SET body_shape_id = $1 WHERE clerk_id = $2`
		await client.query(updateBodyTypeQuery, [bodyTypeId, clerkId])

		// update height
		const heightQuery = `SELECT id from height WHERE name = $1`
		const heightResult = await client.query(heightQuery, [height])

		if (heightResult.rows.length === 0) throw new Error('height not found')

		const heightId = heightResult.rows[0].id

		const updateHeightQuery = `UPDATE users SET height_id = $1 WHERE clerk_id = $2 RETURNING id`
		const updateHeightResult = await client.query(updateHeightQuery, [
			heightId,
			clerkId,
		])

		// update favorite parts

		const dbUserId = updateHeightResult.rows[0].id
		for (const part of favoriteParts) {
			const updateFavoritePartsQuery = `INSERT INTO user_favorite_parts (user_id, body_part_id) VALUES ($1, $2)`
			await client.query(updateFavoritePartsQuery, [dbUserId, part])
		}

		// update least favorite parts
		for (const part of leastFavoriteParts) {
			const updateLeastFavoritePartsQuery = `INSERT INTO user_least_favorite_parts (user_id, body_part_id) VALUES ($1, $2)`
			await client.query(updateLeastFavoritePartsQuery, [dbUserId, part])
		}

		// update personal style
		const personalStyleQuery = `SELECT id from personal_style WHERE name = $1`
		const personalStyleResult = await client.query(personalStyleQuery, [
			personalStyle,
		])

		if (personalStyleResult.rows.length === 0)
			throw new Error('personal style not found')

		const personalStyleId = personalStyleResult.rows[0].id

		const updatePersonalStyleQuery = `UPDATE users SET personal_style_id = $1 WHERE clerk_id = $2`
		await client.query(updatePersonalStyleQuery, [personalStyleId, clerkId])

		// update monthly occasions

		// update goal
		const updateGoalQuery = `UPDATE users SET goal = $1 WHERE clerk_id = $2`
		await client.query(updateGoalQuery, [goal, clerkId])

		// update frustration
		const updateFrustrationQuery = `UPDATE users SET frustration = $1, onboarded = true WHERE clerk_id = $2 RETURNING id`
		const result = await client.query(updateFrustrationQuery, [
			frustration,
			clerkId,
		])
		await createUserWardrobe(result.rows[0].id, bodyType)

		console.log('User details updated successfully')
		return result.rows[0].id
	} catch (error) {
		console.error('Error updating user details:', error)
		throw new Error('Failed to update user details')
	} finally {
		client.release()
	}
}
