import React from 'react'
import { BODY_TYPES } from '../constants'

export default function SelectBodyType({
	bodyType,
	setBodyType,
	handleNext,
}: any) {
	return (
		<div className='bg-primary p-8 flex flex-col items-center justify-center'>
			<h1 className='text-left font-semibold text-[1rem] md:text-[1.2rem] md:px-8 mb-5 text-accent tracking-wide w-full'>
				Pick a Body Type!
			</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-[1400px] w-full mx-auto px-2 justify-center'>
				{BODY_TYPES.map((type: any) => {
					const isDisabled = type.name !== 'Inverted Triangle'
					return (
						<div
							key={type.name}
							className={`bg-secondary p-3 sm:p-4 transition-all duration-300 ease-in-out flex flex-col items-center border-[1.5px] border-transparent rounded-lg ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'} ${isDisabled ? 'relative' : ''}`}
							onClick={() => {
								if (!isDisabled) {
									if (bodyType === type.name) {
										handleNext()
									} else {
										setBodyType(type.name)
										handleNext()
									}
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
