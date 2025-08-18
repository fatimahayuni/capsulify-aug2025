import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/app/lib/database/getUserId'
import { deleteUserImage } from '@/app/lib/database/user_images'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(req: NextRequest) {
	try {
		const userId = await getUserId()
		if (!userId) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			)
		}

		const { imageId, imageUrl, fileName } = await req.json()

		if (!imageId || !imageUrl || !fileName) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			)
		}

		// Delete from Supabase storage
		const { error: storageError } = await supabase.storage
			.from('user-images')
			.remove([`${userId}/${fileName}`])

		if (storageError) {
			console.error('Error deleting from storage:', storageError)
			return NextResponse.json(
				{ error: 'Failed to delete from storage' },
				{ status: 500 }
			)
		}

		// Delete from database
		const dbResult = await deleteUserImage(imageId, userId)
		if (!dbResult) {
			return NextResponse.json(
				{ error: 'Failed to delete from database' },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting image:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
