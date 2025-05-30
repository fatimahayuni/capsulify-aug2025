import React, { useState } from 'react'

export default function ShowOutfits({ outfits, handleSubmit, setStep }: any) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const total = outfits.length
	const handleCardClick = (idx: number) => {
		if (idx !== currentIndex) setCurrentIndex(idx)
	}
	const getOffset = (idx: number) => {
		let offset = idx - currentIndex
		if (offset > total / 2) offset -= total
		if (offset < -total / 2) offset += total
		return offset
	}

	const handleButtonClick = async () => {
		if (isLoading) return // Prevent multiple clicks

		setIsLoading(true)
		try {
			await handleSubmit()
			// If we reach here, the database call was successful
			// The parent component will handle navigation
		} catch (error) {
			console.error('Error during onboarding submission:', error)
			// Re-enable the button on error so user can try again
			setIsLoading(false)
		}
	}

	return (
		<div className='bg-primary flex flex-col items-center px-6 pt-2 md:mt-0 mt-8 mx-2 overflow-x-hidden'>
			<div className='w-full max-w-md md:max-w-xl text-left md:text-center mb-8'>
				<span className='text-lg md:text-[1.25rem] font-bold text-accent'>
					Here
				</span>
				<span className='text-base md:text-[0.9rem] text-accent'>
					{' '}
					is where the transformation begins: check out a few{' '}
					<span className='font-bold md:text-[1rem]'>
						curated outfits
					</span>{' '}
					designed to flatter your body and reflect the woman you're
					becoming.
				</span>
			</div>
			<div className='w-full flex flex-col items-center mt-4 '>
				<div className='relative w-full flex justify-center items-center h-85 md:h-96 select-none'>
					{outfits.map((outfit: any, idx: number) => {
						const offset = getOffset(idx)
						let scale = 1
						let zIndex = 10 - Math.abs(offset)
						let translateX = offset * 80
						let opacity = 1
						let pointer: 'auto' | 'none' = 'auto'
						let blur = ''
						if (offset === 0) {
							scale = 1.1
							zIndex = 20
							translateX = 0
							opacity = 1
							blur = ''
						} else if (Math.abs(offset) === 1) {
							scale = 0.9
							opacity = 0.7
							blur = ''
						} else {
							scale = 0.8
							opacity = 0.3
							pointer = 'none'
							blur = 'blur-sm'
						}
						return (
							<div
								key={idx}
								className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out cursor-pointer ${blur}`}
								style={{
									zIndex,
									transform: `translateX(${translateX}px) scale(${scale})`,
									opacity,
									pointerEvents: pointer,
									width: '16rem',
								}}
								onClick={() => handleCardClick(idx)}
							>
								<div className='bg-secondary rounded-xl flex flex-col items-center py-6 px-4 w-64 mx-auto shadow-none'>
									<p className='text-center text-accent font-bold text-sm mb-4'>
										{outfit.event}
									</p>
									<img
										src={outfit.image}
										alt={`${outfit.event} outfit`}
										className='h-50 md:h-56 object-contain mb-4'
									/>
								</div>
							</div>
						)
					})}
				</div>
			</div>
			<div className='flex justify-center w-full max-w-md'>
				<button
					className={`w-[80%] bg-accent text-white font-semibold py-3 rounded-md text-[0.875rem] shadow-md transition-all duration-200 ${
						isLoading
							? 'opacity-50 cursor-not-allowed'
							: 'hover:opacity-90 cursor-pointer'
					}`}
					onClick={handleButtonClick}
					disabled={isLoading}
				>
					{isLoading
						? 'Setting up your profile...'
						: 'Take me to my Fit!'}
				</button>
			</div>
		</div>
	)
}
