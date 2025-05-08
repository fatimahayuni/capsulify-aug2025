import {
	createUser,
	deleteUser,
	updateUser,
} from '@/app/lib/actions/user.actions'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const evt = await verifyWebhook(req)

		// Do something with payload
		// For this guide, log payload to console
		const { id } = evt.data
		const eventType = evt.type
		console.log(
			`Received webhook with ID ${id} and event type of ${eventType}`
		)
		console.log('Webhook payload:', evt.data)

		if (eventType === 'user.created') {
			console.log('New user created:', id)
			// Handle user creation
			const { first_name, last_name, username, email_addresses } =
				evt.data
			const user = createUser({
				name: `${first_name} ${last_name ? last_name : ''}`,
				username: username!,
				email: email_addresses[0].email_address,
				clerkId: id!,
			})
		}
		if (eventType === 'user.updated') {
			console.log('User updated:', id)
			// Handle user update
			const { first_name, last_name, username, email_addresses } =
				evt.data
			const user = updateUser({
				name: `${first_name} ${last_name ? last_name : ''}`,
				username: username!,
				email: email_addresses[0].email_address,
				clerkId: id!,
			})
		}

		if (eventType === 'user.deleted') {
			// Handle user deletion
			deleteUser(id!)
		}

		return new Response('Webhook received', { status: 200 })
	} catch (err) {
		console.error('Error verifying webhook:', err)
		return new Response('Error verifying webhook', { status: 400 })
	}
}
