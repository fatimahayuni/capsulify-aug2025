import pool from './db'

export async function insertUserImage(
	userId: number,
	imageName: string,
	imageUrl: string,
	categoryId: number
): Promise<number | null> {
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')
		const insertQuery = `
      INSERT INTO user_images (user_id, image_name, image_url, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `
		const result = await client.query(insertQuery, [
			userId,
			imageName,
			imageUrl,
			categoryId,
		])
		if (result.rows.length > 0) {
			return result.rows[0].id
		}
		return null
	} catch (error) {
		console.error('Error inserting user image:', error)
		return null
	} finally {
		client.release()
	}
}

export async function getUserImagesByCategory(userId: number) {
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')
		const query = `
			SELECT id, image_name, image_url, category_id
			FROM user_images 
			WHERE user_id = $1 
			ORDER BY category_id DESC
		`
		const result = await client.query(query, [userId])
		return result.rows
	} catch (error) {
		console.error('Error fetching user images by category:', error)
		return []
	} finally {
		client.release()
	}
}

export async function deleteUserImage(imageId: number, userId: number) {
	const client = await pool.connect()
	try {
		await client.query('SET search_path TO capsulify_live')
		const query = `
			DELETE FROM user_images
			WHERE id = $1 AND user_id = $2
		`
		const result = await client.query(query, [imageId, userId])
		return (result.rowCount ?? 0) > 0
	} catch (error) {
		console.error('Error deleting user image:', error)
		return false
	} finally {
		client.release()
	}
}
