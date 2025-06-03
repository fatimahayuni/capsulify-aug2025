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
			<div className='fixed bottom-0 left-0 w-full z-50 bg-primary pb-[env(safe-area-inset-bottom)]'>
				<div className='fixed bottom-0 left-1/2 -translate-x-1/2 z-20 bg-[#f7efe7] px-2 py-1.5 flex items-center w-screen max-w-md justify-between sm:w-[95vw] shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.12)] md:rounded-t-xl lg:rounded-t-xl'>
					{menubarItems.map((item) => (
						<div
							key={item.name}
							className={`flex flex-col items-center justify-center cursor-pointer px-3 py-1 transition-all ${
								pathname === item.pathname
									? 'bg-[#e6dbd0] rounded-full'
									: ''
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
								<img
									src={item.icon as string}
									className={`w-6 h-6 ${item.icon === 'assets/icons/fit-guide.svg' ? 'w-7 h-7' : ''}`}
									style={{ filter: 'var(--accent-filter)' }}
								/>
							</div>
						</div>
					))}
					<div
						className={`absolute top-[-1.5rem] right-[1.6rem] shadow-2xl w-[90px]  z-50 rounded-md font-semibold border-secondary text-accent text-[12px] bg-primary ${
							menuOpen
								? 'opacity-100'
								: 'opacity-0 pointer-events-none'
						}`}
						onClick={() => {
							setIsFeedbackOpen(true)
							setMenuOpen(false)
						}}
					>
						<div className='bg-secondary text-[0.875rem] py-1 rounded-md text-center'>
							Feedback
						</div>
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
