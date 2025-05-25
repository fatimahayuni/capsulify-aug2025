import React from 'react'
import { HEIGHT } from '../constants'

export default function SelectHeight({ height, setHeight, handleNext }: any) {
	const handleChange = (value: string) => {
		if (height === value) {
			handleNext()
		} else {
			setHeight(value)
			handleNext()
		}
	}
	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-4 pt-8'>
			<h2 className='text-accent text-md font-semibold mb-8 pl-2 w-full max-w-md text-left'>
				Choose your height.
			</h2>
			<div className='flex flex-col gap-4 w-full max-w-md'>
				{HEIGHT.map((opt) => (
					<label
						key={opt.value}
						htmlFor={`height-${opt.value}`}
						className={`rounded-xl bg-secondary px-6 py-3 text-left border-2 transition-all duration-200 cursor-pointer select-none border-transparent mx-4 hover:-translate-y-1 hover:shadow-sm`}
						onClick={() => handleChange(opt.value)}
					>
						<input
							type='radio'
							id={`height-${opt.value}`}
							name='height'
							value={opt.value}
							checked={height === opt.value}
							readOnly
							className='sr-only'
						/>
						<div className='text-accent font-semibold text-[0.875rem] mb-1'>
							{opt.label}
						</div>
						<div className='text-[#b6a99a] text-[0.7rem]'>
							{opt.desc}
						</div>
					</label>
				))}
			</div>
		</div>
	)
}
