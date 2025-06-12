import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json()
		const API_KEY = process.env.MAILERLITE_API_KEY || ''
		const GROUP_ID = process.env.MAILERLITE_GROUP_ID || ''

		const mlRes = await fetch(
			`https://api.mailerlite.com/api/v2/groups/${GROUP_ID}/subscribers`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-MailerLite-ApiKey': API_KEY,
				},
				body: JSON.stringify({ email, resubscribe: true }),
			}
		)

		const data = await mlRes.json()
		if (!mlRes.ok) {
			return NextResponse.json(
				{ error: data.error?.message || 'Failed to subscribe' },
				{ status: mlRes.status }
			)
		}

		return NextResponse.json({ success: true })
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong.' },
			{ status: 500 }
		)
	}
}
