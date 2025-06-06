import React, { useState } from 'react'

interface FitGuideTooltipProps {
	onClose: () => void
}

const steps = [
	{
		text: `Welcome to your Fit Guide! This is your personalized wardrobe — handpicked clothing variations tailored to flatter your body shape and reflect your preferences.`,
	},
	{
		text: `Each piece here respects your selected silhouette, coverage, and style personality. Pay close attention to the cuts—they're designed to enhance your best features.`,
	},
	{
		text: (
			<span>
				Want to explore different variations? Tap the edit icon{' '}
				<img
					src='/assets/icons/edit-pencil.svg'
					alt='edit icon'
					className='object-cover w-4 h-4 inline-block mx-1'
				/>{' '}
				to adjust necklines, sleeves, or styles within the boundaries
				that suit your shape.
			</span>
		),
	},
	{
		text: (
			<span>
				Click on the info icon{' '}
				<img
					src='/assets/icons/info.svg'
					alt='edit icon'
					className='w-2 inline-block mx-1'
				/>{' '}
				to learn more about each piece recommended to flatter your body
				shape.
			</span>
		),
	},
	{
		text: `Capsulify keeps the fit smart, so you never have to second-guess your choices.`,
	},
]

export default function FitGuideTooltip({ onClose }: FitGuideTooltipProps) {
	const [step, setStep] = useState(0)

	const handleNext = () => {
		if (step < steps.length - 1) {
			setStep(step + 1)
		} else {
			onClose()
		}
	}

	const handlePrev = () => {
		if (step > 0) {
			setStep(step - 1)
		}
	}

	const isLastStep = step === steps.length - 1

	return (
		<>
			{/* Overlay */}
			<div className='fixed inset-0 bg-black/30 z-40' />
			<div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center w-full max-w-xs sm:max-w-sm'>
				<div className='bg-primary text-accent rounded-lg shadow-xl px-5 py-6 w-full min-h-[100px] flex flex-col justify-between relative'>
					<div className='text-[0.85rem] text-accent font-medium mb-2 min-h-[60px] flex  flex-col items-center'>
						{steps[step].text}
					</div>
					<div className='flex items-center justify-between w-full mt-2'>
						{/* Progress dots */}
						<div className='flex gap-2 items-center'>
							{steps.map((_, idx) => (
								<span
									key={idx}
									className={`w-2 h-2 rounded-full ${step === idx ? 'bg-accent' : 'bg-[#b6a99a] opacity-50'} transition-all`}
								/>
							))}
						</div>
						{isLastStep ? (
							<button
								onClick={onClose}
								className='cursor-pointer ml-auto px-5 py-1.5 rounded-md bg-accent text-white font-semibold text-[0.85rem] shadow hover:bg-accent/90 transition-colors'
							>
								Explore
							</button>
						) : (
							<>
								{/* Left arrow */}
								<button
									onClick={handlePrev}
									disabled={step === 0}
									className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-full transition-colors ml-auto ${step === 0 ? 'bg-[#b6a99a] opacity-40 cursor-not-allowed' : 'bg-accent hover:bg-accent/90'}`}
									aria-label='Previous'
								>
									<svg
										width='18'
										height='18'
										fill='none'
										viewBox='0 0 24 24'
										stroke='white'
										strokeWidth='2'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								</button>
								{/* Next arrow */}
								<button
									onClick={handleNext}
									className='cursor-pointer flex items-center ml-4 justify-center w-8 h-8 rounded-full bg-accent hover:bg-accent/90 transition-colors'
									aria-label='Next'
								>
									<svg
										width='18'
										height='18'
										fill='none'
										viewBox='0 0 24 24'
										stroke='white'
										strokeWidth='2'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M9 5l7 7-7 7'
										/>
									</svg>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
