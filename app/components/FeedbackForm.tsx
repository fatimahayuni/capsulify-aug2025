import React, { useState } from 'react'

type FeedbackFormData = {
	experience: string
	improvements: string[]
	comments: string
}

type FeedbackFormProps = {
	isOpen: boolean
	onClose: () => void
	onSubmit: (data: FeedbackFormData) => Promise<void>
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
	isOpen,
	onClose,
	onSubmit,
}) => {
	const [formData, setFormData] = useState<FeedbackFormData>({
		experience: '',
		improvements: [],
		comments: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError(null)

		try {
			await onSubmit(formData)
			onClose()
		} catch (err) {
			setError('Failed to submit feedback. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
			<div className='bg-primary w-[400px] rounded-lg shadow-lg relative'>
				<button
					onClick={onClose}
					className='absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-accent text-white rounded-full shadow-md hover:scale-110 transition-transform duration-200'
				>
					✕
				</button>

				<form onSubmit={handleSubmit} className='p-6'>
					<h2 className='text-accent text-xl font-semibold mb-4'>
						Give Feedback
					</h2>

					{/* Experience Question */}
					<div className='mb-4'>
						<label className='block text-accent text-sm font-medium mb-2'>
							How was your experience?
						</label>
						<div className='space-y-2'>
							{['Excellent', 'Good', 'Average', 'Poor'].map(
								(option) => (
									<label
										key={option}
										className='flex items-center space-x-2'
									>
										<input
											type='radio'
											name='experience'
											value={option}
											checked={
												formData.experience === option
											}
											onChange={(e) =>
												setFormData({
													...formData,
													experience: e.target.value,
												})
											}
											className='text-accent'
										/>
										<span className='text-accent text-sm'>
											{option}
										</span>
									</label>
								)
							)}
						</div>
					</div>

					{/* Improvements Question */}
					<div className='mb-4'>
						<label className='block text-accent text-sm font-medium mb-2'>
							What could be improved? (Select all that apply)
						</label>
						<div className='space-y-2'>
							{[
								'User Interface',
								'Performance',
								'Features',
								'Usability',
							].map((option) => (
								<label
									key={option}
									className='flex items-center space-x-2'
								>
									<input
										type='checkbox'
										value={option}
										checked={formData.improvements.includes(
											option
										)}
										onChange={(e) => {
											const newImprovements = e.target
												.checked
												? [
														...formData.improvements,
														option,
													]
												: formData.improvements.filter(
														(item) =>
															item !== option
													)
											setFormData({
												...formData,
												improvements: newImprovements,
											})
										}}
										className='text-accent'
									/>
									<span className='text-accent text-sm'>
										{option}
									</span>
								</label>
							))}
						</div>
					</div>

					{/* Comments Question */}
					<div className='mb-4'>
						<label className='block text-accent text-sm font-medium mb-2'>
							Additional Comments
						</label>
						<textarea
							value={formData.comments}
							onChange={(e) =>
								setFormData({
									...formData,
									comments: e.target.value,
								})
							}
							className='w-full p-2 border border-accent/20 rounded-md text-accent text-sm'
							rows={4}
							placeholder='Share your thoughts...'
						/>
					</div>

					{error && (
						<div className='text-red-500 text-sm mb-4'>{error}</div>
					)}

					<button
						type='submit'
						disabled={isSubmitting}
						className='w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50'
					>
						{isSubmitting ? 'Submitting...' : 'Submit Feedback'}
					</button>
				</form>
			</div>
		</div>
	)
}
