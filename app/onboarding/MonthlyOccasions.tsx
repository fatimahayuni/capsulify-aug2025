import React from 'react'
import { MONTHLY_OCCASIONS } from '../constants'

export default function MonthlyOccasions({
	occasions,
	setOccasions,
	handleNext,
}: any) {
	// Page is now optional: Continue is always enabled
	const canContinue = true

	const handleChange = (key: string, delta: number) => {
		setOccasions((prev: any) => {
			const next = Math.max(0, (prev[key] || 0) + delta)
			return { ...prev, [key]: next }
		})
	}

	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-4 pt-8'>
			<div className='w-[90%] max-w-md mx-auto'>
				<h2 className='text-accent text-md font-semibold mb-8 w-full text-left'>
					Typical Monthly Occasions.
				</h2>
				<div className='flex flex-col gap-2 mb-8'>
					{MONTHLY_OCCASIONS.map(({ key, label }) => (
						<div
							key={key}
							className='rounded-md bg-secondary px-4 py-3 flex items-center justify-between'
						>
							<div>
								<div className='text-accent font-semibold text-[0.875rem] mb-1'>
									{label}
								</div>
								<div className='text-[#b6a99a] text-[0.7rem]'>
									How many days per month?
								</div>
							</div>
							<div className='flex items-center'>
								<button
									type='button'
									className='w-8 h-8 cursor-pointer text-lg flex items-center justify-center font-bold disabled:opacity-50'
									onClick={() => handleChange(key, -1)}
									disabled={occasions[key] <= 0}
								>
									–
								</button>
								<span className='w-8 text-center text-accent font-bold text-[1rem]'>
									{String(occasions[key] || 0).padStart(
										2,
										'0'
									)}
								</span>
								<button
									type='button'
									className='w-8 h-8 cursor-pointer flex items-center justify-center font-bold'
									onClick={() => handleChange(key, 1)}
								>
									+
								</button>
							</div>
						</div>
					))}
				</div>
				<button
					className={`w-full bg-accent text-white font-semibold py-3 mb-8 rounded-md text-[0.875rem] shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer`}
					onClick={handleNext}
				>
					Continue
				</button>
			</div>
		</div>
	)
}
