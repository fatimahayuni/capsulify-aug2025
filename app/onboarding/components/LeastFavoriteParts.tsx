import React from 'react'
import { BODY_PARTS } from '../../constants'

export default function LeastFavoriteParts({
	leastFavoriteParts,
	setLeastFavoriteParts,
	handleNext,
}: any) {
	const togglePart = (part: string) => {
		if (leastFavoriteParts.includes(part)) {
			setLeastFavoriteParts(
				leastFavoriteParts.filter((p: string) => p !== part)
			)
		} else {
			setLeastFavoriteParts([...leastFavoriteParts, part])
		}
	}
	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-6 pt-8'>
			<h2 className='text-accent text-md font-semibold mb-6 w-full max-w-md text-left'>
				Which parts of your body do you feel{' '}
				<span className='font-bold'>least confident about</span> or find
				hardest to dress?
			</h2>
			<form className='w-full max-w-md'>
				<div className='grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-8'>
					{BODY_PARTS.map((part) => (
						<label
							key={part}
							htmlFor={`favorite-${part}`}
							className={`rounded-md px-3 py-3 text-[0.7rem] font-medium transition-all duration-300 border-2 cursor-pointer select-none ${leastFavoriteParts.includes(part) ? 'border-transparent bg-[#908075] text-white' : 'border-transparent text-accent bg-secondary'} focus-within:border-accent`}
						>
							<input
								type='checkbox'
								id={`favorite-${part}`}
								checked={leastFavoriteParts.includes(part)}
								onChange={() => togglePart(part)}
								className='sr-only'
							/>
							{part}
						</label>
					))}
				</div>
				<button
					type='button'
					disabled={leastFavoriteParts.length === 0}
					onClick={handleNext}
					className={`w-full bg-accent text-white font-semibold py-3 rounded-md text-base shadow-md transition-all duration-200 ${leastFavoriteParts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
				>
					Continue
				</button>
			</form>
		</div>
	)
}
