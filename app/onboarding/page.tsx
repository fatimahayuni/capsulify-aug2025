'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BODY_TYPES } from '../constants'
import { getBodyTypeDescription, getOutfits } from '../constants/utils'
import { updateUserBodyType } from '../lib/actions/user.actions'
import { useAuth } from '@clerk/nextjs'
import { BODY_TYPE_IMAGES } from '../constants'

export default function OnboardingPage() {
	const { userId: clerkId } = useAuth()
	const [step, setStep] = useState(1)
	const [bodyType, setBodyType] = useState<string | null>(null)
	const [wardrobe, setWardrobe] = useState<any>({})
	const [outfits, setOutfits] = useState<any>([]) // Assuming outfits are fetched or generated based on wardrobe
	const router = useRouter()

	const handleNext = () => {
		if (step === 1 && bodyType) {
			// Fetch wardrobe for selected body type
			const generatedWardrobe = getBodyTypeDescription(bodyType)
			setWardrobe(generatedWardrobe)
		}

		if (step === 2 && bodyType) {
			// Fetch outfits based on wardrobe (mock or real)
			const generatedOutfits = getOutfits(bodyType as string)
			setOutfits(generatedOutfits)
			setStep(3)
			return
		}

		setStep((prev) => prev + 1)
	}

	const handleBack = () => {
		if (step > 1) setStep((prev) => prev - 1)
	}

	const handleSubmit = async () => {
		sessionStorage.setItem('bodyType', bodyType!)
		sessionStorage.setItem('clerkId', clerkId!)
		// update user bodyType in database
		const userId = await updateUserBodyType(bodyType!, clerkId as string)
		sessionStorage.setItem('userId', userId)
		router.push('/inventory')
	}

	return (
		<div>
			{/* Top Nav with Back Button and Progress Dots */}
			<nav className='flex items-center justify-between px-6 pt-6 md:mx-12'>
				<button
					className='text-accent text-3xl focus:outline-none disabled:opacity-40 cursor-pointer'
					onClick={handleBack}
					disabled={step === 1}
					aria-label='Go back'
				>
					&#x2039;
				</button>
				<div className='flex items-center space-x-2'>
					{[1, 2, 3].map((s) => (
						<span
							key={s}
							className={`w-2 h-2 rounded-full inline-block ${step >= s ? 'bg-accent' : 'bg-[#cbb6a0]'}`}
						></span>
					))}
				</div>
			</nav>

			{step === 1 && (
				<Step1_SelectBodyType
					bodyType={bodyType}
					setBodyType={setBodyType}
					handleNext={handleNext}
				/>
			)}
			{step === 2 && (
				<Step2_ShowBodyTypeResults
					bodyType={bodyType}
					setStep={setStep}
					handleNext={handleNext}
				/>
			)}
			{step === 3 && (
				<Step3_ShowOutfits
					outfits={outfits}
					handleSubmit={handleSubmit}
					setStep={setStep}
				/>
			)}
		</div>
	)
}

function Step1_SelectBodyType({ bodyType, setBodyType, handleNext }: any) {
	return (
		<div className='bg-primary p-8 flex flex-col items-center justify-center'>
			<h1 className='text-center text-[1rem] px-8 md:text-[1.5rem] mb-5 text-accent tracking-wide w-full'>
				Pick a <span className='font-semibold'>Body Type</span> to
				Unlock your Curated Wardrobe!
			</h1>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-[1400px] w-full mx-auto px-2 justify-center'>
				{BODY_TYPES.map((type) => {
					const isDisabled = type.name !== 'Inverted Triangle'

					return (
						<div
							key={type.name}
							className={`
              bg-secondary p-3 sm:p-4 transition-all duration-300 ease-in-out
              flex flex-col items-center border-[1.5px] border-transparent rounded-lg
              ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
              ${bodyType === type.name ? 'border-accent shadow-lg' : ''}
              ${isDisabled ? 'relative' : ''}
            `}
							onClick={() => {
								if (!isDisabled) {
									setBodyType(type.name)
									handleNext()
								}
							}}
						>
							{isDisabled && (
								<div className='absolute inset-0 flex items-center justify-center rounded-lg bg-secondary opacity-90'>
									<p className='text-accent text-[0.65rem] text-center px-2 uppercase tracking-wider'>
										Coming Soon
									</p>
								</div>
							)}

							<div className='w-full mb-4'>
								<img
									src={type.image}
									alt={type.name}
									className='h-[200px] object-contain sm:h-[180px] md:h-[160px] mx-auto'
								/>
							</div>

							<div className='text-left w-full'>
								<h3 className='text-[0.8rem] mt-2 mb-3 text-accent font-extrabold uppercase'>
									{type.name}
								</h3>
								<p className='text-[0.8rem] text-accent leading-relaxed tracking-wider m-0 text-left w-full'>
									{type.description}
								</p>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

function Step2_ShowBodyTypeResults({ bodyType, handleNext }: any) {
	const { description, recommendations, benefits } =
		getBodyTypeDescription(bodyType)

	return (
		<div className='w-full flex items-center justify-center bg-primary px-4 py-8'>
			<div className='rounded-2xl w-full max-w-[800px] mx-auto p-2'>
				<p
					className='text-accent text-[1.25rem] md:text-[1.25rem] font-medium tracking-wide text-left mb-8'
					style={{ fontFamily: 'inherit' }}
				>
					Because your body shape is{' '}
					<span className='font-bold italic text-accent'>
						{bodyType}
					</span>
					,
				</p>
				<p
					className='text-accent mb-8 text-[0.875rem] md:text-[1rem] leading-[1.6] tracking-wide text-left'
					style={{ fontFamily: 'inherit' }}
				>
					{description}
				</p>
				<p
					className='text-accent text-[0.875rem] md:text-[1rem] font-semibold tracking-wide text-left mb-4'
					style={{ fontFamily: 'inherit' }}
				>
					You'll receive tailored recommendations for:
				</p>
				<div className='bg-secondary rounded-xl px-4 py-4 text-center mb-8'>
					<span
						className='text-accent text-[0.875rem] md:text-[0.95rem] font-medium tracking-wide'
						style={{ fontFamily: 'inherit' }}
					>
						{recommendations}
					</span>
				</div>
				<p
					className='text-accent text-[0.875rem] md:text-[1rem] leading-[1.6] tracking-wide text-left mb-0'
					style={{ fontFamily: 'inherit' }}
				>
					{benefits}
				</p>
				<div className='flex justify-center mt-6 w-full rounded-lg'>
					<img
						src={`${BODY_TYPE_IMAGES.image}`}
						alt={BODY_TYPE_IMAGES.image}
						width={400}
						height={400}
						className='rounded-lg'
					/>
				</div>
				<div className='flex justify-center mt-12 w-full'>
					<button
						className='bg-accent text-white border-none py-2 px-4 text-[0.875rem] rounded-md cursor-pointer transition-all duration-300 shadow-md tracking-wide hover:-translate-y-0.5 hover:opacity-90'
						onClick={() => {
							handleNext()
						}}
					>
						Continue
					</button>
				</div>
			</div>
		</div>
	)
}

function Step3_ShowOutfits({ outfits, handleSubmit }: any) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const total = outfits.length

	// Helper to handle card click (circular)
	const handleCardClick = (idx: number) => {
		if (idx !== currentIndex) setCurrentIndex(idx)
	}

	// Helper to get circular offset
	const getOffset = (idx: number) => {
		let offset = idx - currentIndex
		if (offset > total / 2) offset -= total
		if (offset < -total / 2) offset += total
		return offset
	}

	return (
		<div className='bg-primary flex flex-col items-center px-6 pt-2 md:mt-0 mt-8 mx-2'>
			{/* Description */}
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

			{/* Coverflow Carousel */}
			<div className='w-full flex flex-col items-center mt-4'>
				<div className='relative w-full flex justify-center items-center h-96 select-none '>
					{outfits.map((outfit: any, idx: number) => {
						// Calculate circular offset
						const offset = getOffset(idx)
						let scale = 1
						let zIndex = 10 - Math.abs(offset)
						let translateX = offset * 80 // px
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
										className='h-56 object-contain mb-4'
									/>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Navigation Button */}
			<div className='flex justify-center w-full max-w-md'>
				<button
					className='bg-accent text-[0.8rem] text-white p-3 rounded-md flex items-center justify-center tracking-wide hover:opacity-90 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 shadow-md'
					onClick={handleSubmit}
				>
					Take me to my wardrobe!
				</button>
			</div>
		</div>
	)
}
