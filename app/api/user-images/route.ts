import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/app/lib/database/getUserId'
import { getUserImagesByCategory } from '@/app/lib/database/user_images'

export async function GET(req: NextRequest) {
	try {
		const userId = await getUserId()
		console.log('am i getting the user id', userId)
		if (!userId) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			)
		}

		const images = await getUserImagesByCategory(userId)
		console.log('am i getting the images array?', images)
		return NextResponse.json({ images })
	} catch (error) {
		console.error('Error fetching user images:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch images' },
			{ status: 500 }
		)
	}
}
