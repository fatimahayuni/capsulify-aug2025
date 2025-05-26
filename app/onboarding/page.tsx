'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBodyTypeDescription, getOutfits } from '../constants/utils'
import {
	updateUserBodyType,
	updateUserDetails,
} from '../lib/actions/user.actions'
import { useAuth, useUser } from '@clerk/nextjs'
import SelectBodyType from './SelectBodyType'
import SelectHeight from './SelectHeight'
import FavoriteParts from './FavoriteParts'
import LeastFavoriteParts from './LeastFavoriteParts'
import PersonalStyle from './PersonalStyle'
import ShowBodyTypeResults from './ShowBodyTypeResults'
import ShowOutfits from './ShowOutfits'
import UserInfo from './UserInfo'
import MonthlyOccasions from './MonthlyOccasions'
import GoalFrustration from './GoalFrustration'
import { OnboardingData } from '../types'

export default function OnboardingPage() {
	const { userId: clerkId } = useAuth()
	const [step, setStep] = useState(0)

	const [onboardingData, setOnboardingData] = useState({
		ageGroup: '',
		location: '',
		bodyType: '',
		height: '',
		favoriteParts: [],
		leastFavoriteParts: [],
		personalStyle: '',
		occasions: {
			work: 0,
			dates: 0,
			social: 0,
			errands: 0,
			family: 0,
			evening: 0,
			travels: 0,
		},
		goal: '',
		frustration: '',
	})
	const [wardrobe, setWardrobe] = useState<any>({})
	const [outfits, setOutfits] = useState<any>([])
	const router = useRouter()

	const handleNext = () => {
		if (
			step === 1 &&
			onboardingData.ageGroup &&
			onboardingData.location !== undefined
		) {
			setStep(2)
			return
		}
		if (step === 2 && onboardingData.bodyType) {
			setStep(3)
			return
		}
		if (step === 3 && onboardingData.height) {
			setStep(4)
			return
		}
		if (step === 4 && onboardingData.favoriteParts.length > 0) {
			setStep(5)
			return
		}
		if (step === 5 && onboardingData.leastFavoriteParts.length > 0) {
			setStep(6)
			return
		}
		if (step === 6 && onboardingData.personalStyle) {
			setStep(7)
			return
		}
		if (
			step === 7 &&
			Object.values(onboardingData.occasions).some((v) => v > 0)
		) {
			setStep(8)
			return
		}
		if (step === 8 && onboardingData.bodyType) {
			const generatedWardrobe = getBodyTypeDescription(
				onboardingData.bodyType
			)
			setWardrobe(generatedWardrobe)
		}
		if (step === 9 && onboardingData.bodyType) {
			const generatedOutfits = getOutfits(
				onboardingData.bodyType as string
			)
			setOutfits(generatedOutfits)
			setStep(10)
			return
		}
		setStep((prev) => prev + 1)
	}

	const handleBack = () => {
		if (step > 0) setStep((prev) => prev - 1)
	}
	const handleSubmit = async () => {
		// await updateUserBodyType(onboardingData.bodyType!, clerkId as string)
		await updateUserDetails(
			onboardingData as OnboardingData,
			clerkId as string
		)
		router.push('/inventory')
	}

	return (
		<div>
			{step !== 0 && (
				<nav className='flex items-center justify-between px-6 pt-6 md:mx-12'>
					<button
						className='text-accent text-3xl focus:outline-none disabled:opacity-40 cursor-pointer'
						onClick={handleBack}
						disabled={step === 0}
						aria-label='Go back'
					>
						&#x2039;
					</button>
					<div className='flex items-center space-x-2'>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((s) => (
							<span
								key={s}
								className={`w-2 h-2 rounded-full inline-block ${step >= s ? 'bg-accent' : 'bg-[#cbb6a0]'}`}
							></span>
						))}
					</div>
				</nav>
			)}

			{step === 0 && <Step0_Welcome handleNext={handleNext} />}
			{step === 1 && (
				<UserInfo
					ageGroup={onboardingData.ageGroup}
					setAgeGroup={(val: string) =>
						setOnboardingData((prev: any) => ({
							...prev,
							ageGroup: val,
						}))
					}
					location={onboardingData.location}
					setLocation={(val: string) =>
						setOnboardingData((prev: any) => ({
							...prev,
							location: val,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 2 && (
				<SelectBodyType
					bodyType={onboardingData.bodyType}
					setBodyType={(val: string) =>
						setOnboardingData((prev: any) => ({
							...prev,
							bodyType: val,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 3 && (
				<SelectHeight
					height={onboardingData.height}
					setHeight={(val: string) =>
						setOnboardingData((prev: any) => ({
							...prev,
							height: val,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 4 && (
				<FavoriteParts
					favoriteParts={onboardingData.favoriteParts}
					setFavoriteParts={(arr: string[]) =>
						setOnboardingData((prev: any) => ({
							...prev,
							favoriteParts: arr,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 5 && (
				<LeastFavoriteParts
					leastFavoriteParts={onboardingData.leastFavoriteParts}
					setLeastFavoriteParts={(arr: string[]) =>
						setOnboardingData((prev: any) => ({
							...prev,
							leastFavoriteParts: arr,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 6 && (
				<PersonalStyle
					personalStyle={onboardingData.personalStyle}
					setPersonalStyle={(val: string) =>
						setOnboardingData((prev: any) => ({
							...prev,
							personalStyle: val,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 7 && (
				<MonthlyOccasions
					occasions={onboardingData.occasions}
					setOccasions={(updater: any) =>
						setOnboardingData((prev: any) => ({
							...prev,
							occasions:
								typeof updater === 'function'
									? updater(prev.occasions)
									: updater,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 8 && (
				<GoalFrustration
					goal={onboardingData.goal}
					setGoal={(val: string) =>
						setOnboardingData((prev: any) => ({
							...prev,
							goal: val,
						}))
					}
					frustration={onboardingData.frustration}
					setFrustration={(val: string) =>
						setOnboardingData((prev: any) => ({
							...prev,
							frustration: val,
						}))
					}
					handleNext={handleNext}
				/>
			)}
			{step === 9 && (
				<ShowBodyTypeResults
					bodyType={onboardingData.bodyType}
					handleNext={handleNext}
				/>
			)}
			{step === 10 && (
				<ShowOutfits
					outfits={outfits}
					handleSubmit={handleSubmit}
					setStep={setStep}
				/>
			)}
		</div>
	)
}

function Step0_Welcome({ handleNext }: { handleNext: () => void }) {
	const { user: clerkUser } = useUser()
	return (
		<div className='flex flex-col items-center justify-center min-h-[80vh] px-4 bg-primary'>
			<div className='flex flex-col items-center w-full max-w-md mx-auto py-12 rounded-2xl'>
				{/* Capsulify Logo */}
				<div className='mb-8 mt-4'>
					<img
						src='/assets/images/logo/logo.svg'
						alt='Capsulify Logo'
						className='w-10 h-10 md:w-10 md:h-10 object-contain mx-auto fill-accent'
					/>
				</div>
				<h1 className='text-xl md:text-2xl font-bold text-accent mb-4 text-center'>
					Hi, {clerkUser?.firstName}!
				</h1>
				<p className='text-accent text-[0.9rem] md:text-base text-center mb-12 px-6'>
					Let's get to know your style a little better!
					<br />
					Answer a few quick questions to help us unlock your
					personalized, curated wardrobe!
				</p>
				<p className='text-[#b6a99a] text-[0.75rem] text-center mb-8'>
					Your answers will guide us through this process.
				</p>
				<button
					className='w-[40%] max-w-xs bg-accent text-white font-semibold py-3 cursor-pointer rounded-md text-[0.875rem] shadow-md hover:opacity-90 transition-all duration-200'
					onClick={handleNext}
				>
					Let's Go
				</button>
			</div>
		</div>
	)
}

/* {
    "ageGroup": "25 – 34",
    "location": "",
    "bodyType": "Inverted Triangle",
    "height": "Petite",
    "favoriteParts": [
        "Neck / Collarbone",
        "Back (Upper/Mid)"
    ],
    "leastFavoriteParts": [
        "Knees",
        "Feet"
    ],
    "personalStyle": "Classic",
    "occasions": {
        "work": 3,
        "dates": 0,
        "social": 0,
        "errands": 1,
        "family": 0,
        "evening": 2,
        "travels": 0
    },
    "goal": "",
    "frustration": ""
} */
