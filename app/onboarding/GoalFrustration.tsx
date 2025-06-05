import React from 'react'

export default function GoalFrustration({
	goal,
	setGoal,
	frustration,
	setFrustration,
	handleNext,
}: any) {
	// Require both fields to be filled with non-empty strings
	const canContinue = goal.trim().length > 0 && frustration.trim().length > 0

	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-4 pt-8'>
			<div className='w-[90%] max-w-md mx-auto'>
				<div className='mb-8'>
					<label
						className='block text-accent text-[0.875rem] font-semibold mb-3'
						htmlFor='goal'
					>
						What is your goal with Capsulify? Please describe in a
						few words.
					</label>
					<textarea
						id='goal'
						value={goal}
						onChange={(e) => setGoal(e.target.value)}
						placeholder='Enter your goal here...'
						className='w-full min-h-[80px] rounded-md bg-secondary px-4 py-3 text-accent text-[0.875rem] placeholder-[#b6a99a] border-2 border-transparent focus:border-accent outline-none transition-all duration-200 mb-6'
						required
					/>
				</div>
				<div className='mb-10'>
					<label
						className='block text-accent text-[0.875rem] font-semibold mb-3'
						htmlFor='frustration'
					>
						What is your biggest frustration when it comes to
						styling?
					</label>
					<textarea
						id='frustration'
						value={frustration}
						onChange={(e) => setFrustration(e.target.value)}
						placeholder='Enter your frustration here...'
						className='w-full min-h-[80px] rounded-md bg-secondary px-4 py-3 text-accent text-[0.875rem] placeholder-[#b6a99a] border-2 border-transparent focus:border-accent outline-none transition-all duration-200'
						required
					/>
				</div>
				<button
					className={`w-full bg-accent text-white font-semibold py-3 rounded-md text-[0.875rem] shadow-md transition-all duration-200 ${!canContinue ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
					disabled={!canContinue}
					onClick={handleNext}
				>
					Continue
				</button>
			</div>
		</div>
	)
}
