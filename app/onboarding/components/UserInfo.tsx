import React, { useState } from 'react'
import { AGE_GROUPS } from '../../constants'

export default function UserInfo({
	ageGroup,
	setAgeGroup,
	location,
	setLocation,
	handleNext,
}: any) {
	const [touched, setTouched] = useState(false)
	const canContinue = !!ageGroup && !!location

	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-4 pt-8'>
			<div className='w-[90%] max-w-md mx-auto'>
				<div className='mb-4'>
					<h3 className='text-accent text-[0.875rem] font-semibold mb-3'>
						Which age group would you belong to?
					</h3>
					<div className='flex flex-col gap-3'>
						{AGE_GROUPS.map((opt) => (
							<label
								key={opt}
								htmlFor={`age-${opt}`}
								className={`rounded-md px-6 py-2 text-left border-2 transition-all duration-200 cursor-pointer select-none border-transparent ${ageGroup === opt ? 'bg-[#908075] text-white' : 'text-accent bg-secondary'} focus-within:border-accent`}
								onClick={() => setAgeGroup(opt)}
							>
								<input
									type='radio'
									id={`age-${opt}`}
									name='ageGroup'
									value={opt}
									checked={ageGroup === opt}
									readOnly
									className='sr-only'
								/>
								<span className='font-semibold text-[0.75rem]'>
									{opt}
								</span>
							</label>
						))}
					</div>
				</div>
				<div className='mb-8 mt-6'>
					<h3 className='text-accent text-[0.875rem] font-semibold mb-3'>
						Where is your location/Where do you live?{' '}
					</h3>
					<input
						type='text'
						value={location}
						onChange={(e) => {
							setLocation(e.target.value)
							setTouched(true)
						}}
						placeholder='Country/Region'
						className='w-full rounded-md bg-secondary px-2 py-2 text-accent text-[0.875rem] placeholder-[#b6a99a] border-2 border-transparent focus:border-accent outline-none transition-all duration-200'
					/>
				</div>
				<button
					className={`w-full bg-accent text-white font-semibold py-3 mb-6 rounded-md text-[0.875rem] shadow-md transition-all duration-200 ${!canContinue ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
					disabled={!canContinue}
					onClick={handleNext}
				>
					Continue
				</button>
			</div>
		</div>
	)
}
