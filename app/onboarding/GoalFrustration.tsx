import React from 'react'

export default function GoalFrustration({
	goal,
	setGoal,
	frustration,
	setFrustration,
	handleNext,
}: any) {
	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-4 pt-8'>
			<div className='w-[90%] max-w-md mx-auto'>
				<div className='mb-8'>
					<label
						className='block text-accent text-[0.875rem] font-semibold mb-3'
						htmlFor='goal'
					>
						What is your goal with Capsulify? Please describe in a
						few words.{' '}
					</label>
					<textarea
						id='goal'
						value={goal}
						onChange={(e) => setGoal(e.target.value)}
						placeholder=''
						className='w-full min-h-[80px] rounded-md bg-secondary px-4 py-3 text-accent text-[0.875rem] placeholder-[#b6a99a] border-2 border-transparent focus:border-accent outline-none transition-all duration-200 mb-6'
					/>
				</div>
				<div className='mb-10'>
					<label
						className='block text-accent text-[0.875rem] font-semibold mb-3'
						htmlFor='frustration'
					>
						What is your biggest frustration when it comes to
						styling?{' '}
					</label>
					<textarea
						id='frustration'
						value={frustration}
						onChange={(e) => setFrustration(e.target.value)}
						placeholder=''
						className='w-full min-h-[80px] rounded-md bg-secondary px-4 py-3 text-accent text-[0.875rem] placeholder-[#b6a99a] border-2 border-transparent focus:border-accent outline-none transition-all duration-200'
					/>
				</div>
				<button
					className='w-full bg-accent text-white font-semibold py-3 rounded-md text-[0.875rem] shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer'
					onClick={handleNext}
				>
					Continue
				</button>
			</div>
		</div>
	)
}
