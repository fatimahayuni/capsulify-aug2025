'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useState } from 'react'
import { FeedbackForm } from './FeedbackForm'

type MenubarItem = {
	name?: string
	icon: ReactNode | string
	pathname?: string
	onClick?: () => void
}

const Menubar = () => {
	const router = useRouter()
	const pathname = usePathname()
	const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)

	const handleSubmit = async (data: any) => {
		const response = await fetch('/api/feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Failed to submit feedback')
		}
	}

	const menubarItems: MenubarItem[] = [
		{
			name: 'Home',
			icon: 'assets/icons/home.svg',
			pathname: '/home',
		},
		{
			name: 'Fit',
			icon: 'assets/icons/fit-guide.svg',
			pathname: '/inventory',
		},
		{
			name: 'Outfits',
			icon: 'assets/icons/outfits.svg',
			pathname: '/outfits',
		},
		{
			name: 'Menu',
			icon: 'assets/icons/menu.svg',
			onClick: () => {
				setMenuOpen(!menuOpen)
			},
		},
	]

	return (
		<div>
			<div className='max-sm:flex fixed w-fit rounded-full left-[50%] translate-x-[-50%] bottom-6 shadow-sm z-20 bg-primary'>
				<div className='flex justify-center items-center rounded-full w-full mx-auto bg-[#4a34272c] px-4 relative'>
					{menubarItems.map((item) => (
						<div
							key={item.name}
							className={`flex flex-col items-center justify-center cursor-pointer px-3 py-1 ${
								pathname === item.pathname ? 'bg-primary' : ''
							}`}
							onClick={() => {
								if (item.pathname) {
									router.push(item.pathname)
									setMenuOpen(false)
								} else if (item.onClick) {
									item.onClick()
								}
							}}
						>
							<div className='flex items-center justify-center w-10 h-9'>
								<img src={item.icon as string} />
							</div>
							<span className='text-[8px]'>{item.name}</span>
						</div>
					))}
				</div>

				<div
					className={`absolute top-[-1.25rem] right-[-2rem] shadow-2xl w-[90px]  z-50 rounded-md font-semibold border-secondary text-accent text-[12px] bg-primary ${
						menuOpen
							? 'opacity-100'
							: 'opacity-0 pointer-events-none'
					}`}
					onClick={() => {
						setIsFeedbackOpen(true)
						setMenuOpen(false)
					}}
				>
					<div className='bg-[#4a34272c] py-1 pl-2 rounded-md'>
						Feedback
					</div>
				</div>
			</div>
			<FeedbackForm
				isOpen={isFeedbackOpen}
				onClose={() => {
					setIsFeedbackOpen(false)
					setMenuOpen(false)
				}}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}

export default Menubar
