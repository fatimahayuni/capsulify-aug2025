import React from 'react'
import { BODY_PARTS } from '../../constants'

export default function FavoriteParts({
	favoriteParts,
	setFavoriteParts,
	handleNext,
}: any) {
	const togglePart = (part: string) => {
		if (favoriteParts.includes(part)) {
			setFavoriteParts(favoriteParts.filter((p: string) => p !== part))
		} else {
			setFavoriteParts([...favoriteParts, part])
		}
	}
	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-6 pt-8'>
			<h2 className='text-accent text-md font-semibold mb-10 w-full max-w-md text-left'>
				What are you <span className='font-bold'>most favorite</span>{' '}
				body parts
				<br className='md:hidden' /> (to accentuate)?
			</h2>
			<form className='w-full max-w-md'>
				<div className='grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-8'>
					{BODY_PARTS.map((part) => (
						<label
							key={part}
							htmlFor={`favorite-${part}`}
							className={`rounded-md px-3 py-3 text-[0.7rem] font-medium transition-all duration-300 border-2 cursor-pointer select-none ${favoriteParts.includes(part) ? 'border-transparent bg-[#908075] text-white' : 'border-transparent text-accent bg-secondary'} focus-within:border-accent`}
						>
							<input
								type='checkbox'
								id={`favorite-${part}`}
								checked={favoriteParts.includes(part)}
								onChange={() => togglePart(part)}
								className='sr-only'
							/>
							{part}
						</label>
					))}
				</div>
				<button
					type='button'
					disabled={favoriteParts.length === 0}
					onClick={handleNext}
					className={`w-full bg-accent text-white font-semibold py-3 rounded-md text-base shadow-md transition-all duration-200 ${favoriteParts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
				>
					Continue
				</button>
			</form>
		</div>
	)
}
