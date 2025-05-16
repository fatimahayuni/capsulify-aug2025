import { auth } from '@clerk/nextjs/server'
import pool from './db'

// getUserId provides the userId for the current user using their clerkId.
// This is safe to use in all server side logic when you need the userId for database operations.
export async function getUserId(): Promise<number | null> {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    return null
  }

  const client = await pool.connect()
  try {
    await client.query('SET search_path TO capsulify_live')
    const getUserIdQuery = `
      SELECT id FROM users WHERE clerk_id = $1
    `
    const result = await client.query(getUserIdQuery, [clerkId])
    
    if (result.rows.length === 0) {
      return null
    }

    const userId = Number(result.rows[0].id)
    return userId
  } catch (error) {
    console.error('Error getting user ID by clerk ID:', error)
    return null
  } finally {
    client.release()
  }
} 