import React, { useState } from 'react'
import { FeedbackForm } from './FeedbackForm'

export const FeedbackButton: React.FC = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)

	const handleSubmit = async (data: any) => {
		const response = await fetch('/api/feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Failed to submit feedback')
		}
	}

	return (
		<>
			<button
				onClick={() => setIsFormOpen(true)}
				className='fixed bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-full shadow-lg hover:bg-accent/90 transition-colors flex items-center space-x-2'
			>
				<span>Give Feedback</span>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path
						fillRule='evenodd'
						d='M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-3a1 1 0 00-.707.293l-4 4a1 1 0 101.414 1.414L9 9.414V13a1 1 0 102 0V9.414l2.293 2.293a1 1 0 001.414-1.414l-4-4A1 1 0 0010 7z'
						clipRule='evenodd'
					/>
				</svg>
			</button>

			<FeedbackForm
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSubmit={handleSubmit}
			/>
		</>
	)
}
