'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BODY_TYPES } from '../constants'
import { getBodyTypeDescription, getOutfits } from '../constants/utils'
import { FaInfoCircle } from 'react-icons/fa'
import { updateUserBodyType } from '../lib/actions/user.actions'
import { useAuth } from '@clerk/nextjs'

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
			const generatedWardrobe = BODY_TYPES.find(
				(type) => type.name === bodyType
			)?.clothingItems
			setWardrobe(generatedWardrobe)
		}

		if (step === 4) {
			// Fetch outfits based on wardrobe (mock or real)
			const generatedOutfits = getOutfits(bodyType as string)
			setOutfits(generatedOutfits)
		}
		setStep((prev) => prev + 1)
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
				<Step2_ShowWardrobe wardrobe={wardrobe} setStep={setStep} />
			)}

			{step === 4 && (
				<OutfitIntro setStep={setStep} handleNext={handleNext} />
			)}
			{step === 5 && (
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
		<div className='min-h-screen bg-primary p-8 flex flex-col items-center justify-center'>
			<h1 className='text-center text-[1.5rem] mb-5 text-accent tracking-wide w-full'>
				Select Your{' '}
				<span className='font-semibold uppercase'>Body Type</span> to
				Unlock Curated Wardrobe!
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

function Step2_ShowBodyTypeResults({ bodyType, setStep, handleNext }: any) {
	const { description, recommendations, benefits } =
		getBodyTypeDescription(bodyType)

	return (
		<div className='result-container'>
			<div className='result-card'>
				<p>
					Because your body shape is{' '}
					<span className='selected-body-type'>{bodyType}</span>,
				</p>
				<p className='result-description'>{description}</p>
				<p>You'll receive tailored recommendations for:</p>
				<p className='recommendations'>{recommendations}</p>
				<p className='benefits'>{benefits}</p>
			</div>

			<div className='navigation-arrows-container'>
				<button
					className='nav-arrow-button'
					onClick={() => {
						// Logic to go back to the previous step
						setStep((prev: any) => prev - 1)
					}}
				>
					‹
				</button>
				<button
					className='nav-arrow-button'
					onClick={() => {
						// Logic to go to the next step
						handleNext()
					}}
				>
					›
				</button>
			</div>
		</div>
	)
}

function Step2_ShowWardrobe({ wardrobe, setStep }: any) {
	return (
		<div className='category-container'>
			<div className='category-section'>
				<div className='category-content'>
					{Object.keys(wardrobe).map((key) => (
						<div key={key} className='category-block'>
							{
								<div className='styling-tip'>
									<p className='styling-tip-text'>
										<span className='category'>
											{key.toUpperCase()}
										</span>
									</p>
								</div>
							}

							<div className='category-grid'>
								{wardrobe[key].map((item: any) => (
									<div
										key={item.name}
										className='category-item'
										data-category={key}
									>
										<div className='info-icon-container'>
											<FaInfoCircle className='info-icon' />
										</div>
										<div className='image-wrapper'>
											<img
												src={item.filename}
												alt={item.name}
												className='category-image'
											/>
										</div>
										<p className='category-name'>
											{item.name}
										</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className='navigation-arrows-container'>
					<button
						className='nav-arrow-button'
						onClick={() => {
							// Logic to go back to the previous step
							setStep((prev: any) => prev - 1)
						}}
					>
						‹
					</button>
					<button
						className='nav-arrow-button'
						onClick={() => {
							// Logic to go to the next step
							setStep((prev: any) => prev + 1)
						}}
					>
						›
					</button>
				</div>
			</div>
		</div>
	)
}

function OutfitIntro({ setStep, handleNext }: any) {
	return (
		<div className='outfit-intro-container'>
			<div className='outfit-intro-card'>
				<div className='outfit-intro-content'>
					<p className='outfit-intro-text'>
						Let's bring your wardrobe to life
					</p>
					<p className='outfit-intro-subtext'>
						Here's where the transformation begins: curated outfit
						ideas designed to flatter your body and reflect the
						woman you're becoming. You'll be able to customize
						everything with your own pieces later on.
					</p>
					<div className='navigation-arrows-container'>
						<button
							className='nav-arrow-button'
							onClick={() => {
								// Logic to go back to the previous step
								setStep((prev: any) => prev - 1)
							}}
						>
							‹
						</button>
						<button
							className='nav-arrow-button'
							onClick={() => {
								// Logic to go to the next step
								handleNext()
							}}
						>
							›
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

function Step3_ShowOutfits({ outfits, handleSubmit, setStep }: any) {
	const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0)
	return (
		<div className='outfits-container'>
			<div className='outfits-content'>
				<div className='outfits-carousel'>
					<button
						className='carousel-button'
						onClick={() =>
							setCurrentOutfitIndex((prev) =>
								prev > 0 ? prev - 1 : prev
							)
						}
						disabled={currentOutfitIndex === 0}
					>
						‹
					</button>
					<div className='outfit-display'>
						<p className='outfit-event-name'>
							{outfits[currentOutfitIndex].event}
						</p>
						<div className='outfit-image-container'>
							<img
								src={outfits[currentOutfitIndex].image}
								alt={`${outfits[currentOutfitIndex].event} outfit`}
								className='outfit-image'
							/>
						</div>
					</div>
					<button
						className='carousel-button'
						onClick={() =>
							setCurrentOutfitIndex((prev) =>
								prev < outfits.length - 1 ? prev + 1 : prev
							)
						}
						disabled={currentOutfitIndex === outfits.length - 1}
					>
						›
					</button>
				</div>
			</div>

			<div className='navigation-arrows-container bottom-buttons'>
				<button
					className='next-button'
					onClick={() => {
						setStep((prev: any) => prev - 1)
					}}
				>
					Go back
				</button>
				<button className='next-button' onClick={() => handleSubmit()}>
					Take me to the app
				</button>
			</div>
		</div>
	)
}
