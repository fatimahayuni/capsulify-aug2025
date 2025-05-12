import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { FeedbackEmail } from '@/app/emails/FeedbackEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { experience, improvements, comments } = body

		// Validate required fields
		if (!experience) {
			return NextResponse.json(
				{ error: 'Experience rating is required' },
				{ status: 400 }
			)
		}

		// Send email using Resend
		const { data, error } = await resend.emails.send({
			from: 'Capsulify <onboarding@resend.dev>',
			to: 'capsulifyapp@gmail.com',
			subject: 'New Feedback from Capsulify User',
			react: FeedbackEmail({
				userName: 'Test User',
				userEmail: 'capsulifyapp@gmail.com',
				feedback: {
					experience,
					improvements,
					comments,
				},
			}),
		})

		if (error) {
			console.error('Failed to send feedback email:', error)
			return NextResponse.json(
				{ error: 'Failed to send feedback' },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true, data })
	} catch (error) {
		console.error('Error processing feedback:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
