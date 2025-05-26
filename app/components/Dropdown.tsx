'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownOption {
	label: string
	value: string | number
}

interface DropdownProps {
	options: DropdownOption[]
	value: string | number
	onChange: (value: string | number) => void
	placeholder?: string
	className?: string
}

const Dropdown = ({
	options,
	value,
	onChange,
	placeholder = 'Select...',
	className = '',
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			setIsOpen(!isOpen)
		} else if (e.key === 'Escape') {
			setIsOpen(false)
		}
	}

	const selectedOption = options.find((option) => option.value === value)

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			{/* Dropdown Button */}
			<button
				type='button'
				className='w-full flex items-center mx-auto justify-between px-3 py-2 text-sm bg-transparent border border-accent/40 rounded-md'
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				aria-haspopup='listbox'
				aria-expanded={isOpen}
			>
				<span className='text-accent font-medium'>
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<ChevronDown
					className={`w-4 h-4 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div
					className='absolute z-50 w-full mt-1 bg-primary border border-accent/20 rounded-md shadow-lg max-h-60 overflow-auto'
					role='listbox'
				>
					{options.map((option) => (
						<div
							key={option.value}
							className={`px-3 py-2 text-[0.8rem] cursor-pointer text-accent hover:bg-secondary transition-colors ${
								option.value === value ? 'bg-secondary' : ''
							}`}
							onClick={() => {
								onChange(option.value)
								setIsOpen(false)
							}}
							role='option'
							aria-selected={option.value === value}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Dropdown
