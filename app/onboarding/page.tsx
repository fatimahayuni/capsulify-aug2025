'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBodyTypeDescription, getOutfits } from '../constants/utils'
import { saveOnboardingData } from '../lib/actions/user.actions'
import { useAuth, useUser } from '@clerk/nextjs'
import SelectBodyType from './components/SelectBodyType'
import SelectHeight from './components/SelectHeight'
import FavoriteParts from './components/FavoriteParts'
import LeastFavoriteParts from './components/LeastFavoriteParts'
import PersonalStyle from './components/PersonalStyle'
import ShowBodyTypeResults from './components/ShowBodyTypeResults'
import ShowOutfits from './components/ShowOutfits'
import UserInfo from './components/UserInfo'
import MonthlyOccasions from './components/MonthlyOccasions'
import GoalFrustration from './components/GoalFrustration'
import { OnboardingData } from '../types'
import {
  BODY_TYPE_ID,
  AGE_GROUP_ID,
  HEIGHT_GROUP_ID,
  BODY_PARTS_ID,
  PERSONAL_STYLE_ID,
} from '../constants'

// Type for the UI state (using display strings)
type OnboardingUIState = {
  ageGroup: string
  location: string
  bodyType: string
  height: string
  favoriteParts: string[]
  leastFavoriteParts: string[]
  personalStyle: string
  occasions: {
    work: number
    dates: number
    social: number
    errands: number
    family: number
    evening: number
    travels: number
  }
  goal: string
  frustration: string
}

// Helper functions to convert display names to enum IDs
const getAgeGroupIdByName = (name: string): number => {
  const entries = Object.entries(AGE_GROUP_ID)
  for (const [id, ageGroupName] of entries) {
    if (ageGroupName === name) return parseInt(id)
  }
  throw new Error(`Age group '${name}' not found`)
}

const getBodyTypeIdByName = (name: string): number => {
  const entries = Object.entries(BODY_TYPE_ID)
  for (const [id, bodyTypeName] of entries) {
    if (bodyTypeName === name) return parseInt(id)
  }
  throw new Error(`Body type '${name}' not found`)
}

const getHeightIdByName = (name: string): number => {
  const entries = Object.entries(HEIGHT_GROUP_ID)
  for (const [id, heightName] of entries) {
    if (heightName === name) return parseInt(id)
  }
  throw new Error(`Height '${name}' not found`)
}

const getBodyPartIdByName = (name: string): number => {
  const entries = Object.entries(BODY_PARTS_ID)
  for (const [id, bodyPartName] of entries) {
    if (bodyPartName === name) return parseInt(id)
  }
  throw new Error(`Body part '${name}' not found`)
}

const getPersonalStyleIdByName = (name: string): number => {
  const entries = Object.entries(PERSONAL_STYLE_ID)
  for (const [id, styleName] of entries) {
    if (styleName === name) return parseInt(id)
  }
  throw new Error(`Personal style '${name}' not found`)
}

// Convert string-based onboarding data to ID-based format
const convertToOnboardingData = (data: OnboardingUIState): OnboardingData => {
  return {
    ageGroupId: getAgeGroupIdByName(data.ageGroup),
    location: data.location,
    bodyTypeId: getBodyTypeIdByName(data.bodyType),
    heightId: getHeightIdByName(data.height),
    favoritePartIds: data.favoriteParts.map((part: string) =>
      getBodyPartIdByName(part)
    ),
    leastFavoritePartIds: data.leastFavoriteParts.map((part: string) =>
      getBodyPartIdByName(part)
    ),
    personalStyleId: getPersonalStyleIdByName(data.personalStyle),
    occasions: data.occasions,
    goal: data.goal,
    frustration: data.frustration,
  }
}

export default function OnboardingPage() {
  const { userId: clerkId } = useAuth()
  const [step, setStep] = useState(0)

  const [onboardingData, setOnboardingData] = useState<OnboardingUIState>({
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
    if (step === 1 && onboardingData.ageGroup && onboardingData.location !== undefined) {
      setStep(2); return
    }
    if (step === 2 && onboardingData.bodyType) { setStep(3); return }
    if (step === 3 && onboardingData.height) { setStep(4); return }
    if (step === 4 && onboardingData.favoriteParts.length > 0) { setStep(5); return }
    if (step === 5 && onboardingData.leastFavoriteParts.length > 0) { setStep(6); return }
    if (step === 6 && onboardingData.personalStyle) { setStep(7); return }
    if (step === 7 && Object.values(onboardingData.occasions).some((v) => v > 0)) {
      setStep(8); return
    }
    if (step === 8 && onboardingData.bodyType) {
      const generatedWardrobe = getBodyTypeDescription(onboardingData.bodyType)
      setWardrobe(generatedWardrobe)
    }
    if (step === 9 && onboardingData.bodyType) {
      const generatedOutfits = getOutfits(onboardingData.bodyType as string)
      setOutfits(generatedOutfits)
      setStep(10); return
    }
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    const convertedData = convertToOnboardingData(onboardingData)

    // Don’t let a flaky DB write block you from reaching uploads
    try {
      if (!clerkId) throw new Error('Missing clerkId')
      await saveOnboardingData(convertedData, clerkId)
    } catch (err) {
      console.error('saveOnboardingData failed:', err) // TEMP: fix later
    }

    // IndexedDB only exists in the browser — load CacheManager lazily
    try {
      const { default: CacheManager } = await import('../lib/CacheManager')
      await CacheManager.clearUserFitCache()
      await CacheManager.clearUserOutfitsCache()
    } catch (err) {
      console.warn('CacheManager not available (ignored):', err)
    }

    console.log('Onboarding submit → pushing /inventory')
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
            setOnboardingData((prev: any) => ({ ...prev, ageGroup: val }))
          }
          location={onboardingData.location}
          setLocation={(val: string) =>
            setOnboardingData((prev: any) => ({ ...prev, location: val }))
          }
          handleNext={handleNext}
        />
      )}
      {step === 2 && (
        <SelectBodyType
          bodyType={onboardingData.bodyType}
          setBodyType={(val: string) =>
            setOnboardingData((prev: any) => ({ ...prev, bodyType: val }))
          }
          handleNext={handleNext}
        />
      )}
      {step === 3 && (
        <SelectHeight
          height={onboardingData.height}
          setHeight={(val: string) =>
            setOnboardingData((prev: any) => ({ ...prev, height: val }))
          }
          handleNext={handleNext}
        />
      )}
      {step === 4 && (
        <FavoriteParts
          favoriteParts={onboardingData.favoriteParts}
          setFavoriteParts={(arr: string[]) =>
            setOnboardingData((prev: any) => ({ ...prev, favoriteParts: arr }))
          }
          handleNext={handleNext}
        />
      )}
      {step === 5 && (
        <LeastFavoriteParts
          leastFavoriteParts={onboardingData.leastFavoriteParts}
          setLeastFavoriteParts={(arr: string[]) =>
            setOnboardingData((prev: any) => ({ ...prev, leastFavoriteParts: arr }))
          }
          handleNext={handleNext}
        />
      )}
      {step === 6 && (
        <PersonalStyle
          personalStyle={onboardingData.personalStyle}
          setPersonalStyle={(val: string) =>
            setOnboardingData((prev: any) => ({ ...prev, personalStyle: val }))
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
              occasions: typeof updater === 'function' ? updater(prev.occasions) : updater,
            }))
          }
          handleNext={handleNext}
        />
      )}
      {step === 8 && (
        <GoalFrustration
          goal={onboardingData.goal}
          setGoal={(val: string) =>
            setOnboardingData((prev: any) => ({ ...prev, goal: val }))
          }
          frustration={onboardingData.frustration}
          setFrustration={(val: string) =>
            setOnboardingData((prev: any) => ({ ...prev, frustration: val }))
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
