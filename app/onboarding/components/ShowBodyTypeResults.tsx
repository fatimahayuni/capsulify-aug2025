import React from 'react'
import { getBodyTypeDescription } from '../../constants/utils'
import { BODY_TYPE_IMAGES } from '../../constants'

export default function ShowBodyTypeResults({ bodyType, handleNext }: any) {
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
					You'll receive tailored recommendations containing:
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
						className='w-[60%] bg-accent text-white font-semibold py-3 rounded-md text-[0.875rem] shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer'
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
