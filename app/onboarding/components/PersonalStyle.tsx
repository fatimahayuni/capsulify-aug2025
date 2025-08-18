import React from 'react'
import { PERSONAL_STYLE } from '../../constants'

export default function PersonalStyle({
	personalStyle,
	setPersonalStyle,
	handleNext,
}: any) {
	const handleChange = (value: string) => {
		if (personalStyle === value) {
			handleNext()
		} else {
			setPersonalStyle(value)
			handleNext()
		}
	}
	return (
		<div className='flex flex-col items-center w-full min-h-[70vh] px-4 pt-8 mb-8'>
			<h2 className='text-accent text-md font-semibold ml-8 mb-8 w-full max-w-md text-left'>
				How do you define your personal style?
			</h2>
			<div className='flex flex-col gap-4 w-[90%] max-w-md'>
				{PERSONAL_STYLE.map((opt) => (
					<label
						key={opt.label}
						htmlFor={`style-${opt.label}`}
						className={`rounded-xl bg-secondary px-6 py-4 text-left transition-all duration-200 cursor-pointer select-none hover:border-accent hover:shadow-sm hover:-translate-y-1 focus-within:border-accent`}
						onClick={() => handleChange(opt.label)}
					>
						<input
							type='radio'
							id={`style-${opt.label}`}
							name='personalStyle'
							value={opt.label}
							checked={personalStyle === opt.label}
							readOnly
							className='sr-only'
						/>
						<div className='text-accent font-semibold text-[0.8rem] mb-1'>
							{opt.label}
						</div>
						<div className='text-[#ad9f8f] text-[0.65rem]'>
							{opt.desc}
						</div>
					</label>
				))}
			</div>
		</div>
	)
}
