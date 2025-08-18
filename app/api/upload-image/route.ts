import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase/client'
import { getUserId } from '@/app/lib/database/getUserId'
import { insertUserImage } from '@/app/lib/database/user_images'

export async function POST(req: NextRequest) {
	// Parse form data
	const formData = await req.formData()
	const file = formData.get('file') as File
	const categoryId = formData.get('categoryId') as string

	if (!file) {
		return NextResponse.json({ error: 'No file provided' }, { status: 400 })
	}

	if (!categoryId) {
		return NextResponse.json(
			{ error: 'No category provided' },
			{ status: 400 }
		)
	}

	// Only allow jpeg, jpg, png
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
	if (!allowedTypes.includes(file.type)) {
		return NextResponse.json(
			{ error: 'Invalid file type' },
			{ status: 400 }
		)
	}

	// Get user ID from session
	const userId = await getUserId()
	if (!userId) {
		return NextResponse.json(
			{ error: 'Not authenticated' },
			{ status: 401 }
		)
	}

	// Generate unique file name
	const ext = file.name.split('.').pop()
	const fileName = `user_${userId}_${Date.now()}.${ext}`

	// Upload to Supabase Storage
	const { data: uploadData, error: uploadError } = await supabase.storage
		.from('user-images')
		.upload(`${userId}/${fileName}`, file, { contentType: file.type })

	if (uploadError) {
		return NextResponse.json(
			{ error: 'Upload failed', details: uploadError.message },
			{ status: 500 }
		)
	}

	// Get public URL - include the full path with user folder
	const { data: publicUrlData } = supabase.storage
		.from('user-images')
		.getPublicUrl(`${userId}/${fileName}`)
	const imageUrl = publicUrlData.publicUrl

	// Insert into user_images table with category_id
	const insertedId = await insertUserImage(
		userId,
		fileName,
		imageUrl,
		parseInt(categoryId)
	)
	if (!insertedId) {
		return NextResponse.json(
			{ error: 'Database insert failed' },
			{ status: 500 }
		)
	}

	return NextResponse.json({ imageUrl, id: insertedId }, { status: 200 })
}
