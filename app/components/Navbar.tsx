'use client'
import { SignedIn } from '@clerk/nextjs'
import Logo from './Logo'
import ProfileIcon from './ProfileIcon'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

function Navbar() {
	const [title, setTitle] = useState('')
	const pathname = usePathname()
	useEffect(() => {
		const pathnameParts = pathname.split('/')
		if (pathname.includes('inventory')) {
			setTitle('Fit')
		} else if (pathname.includes('outfits')) {
			setTitle('Outfits')
		} else if (pathname.includes('home')) {
			setTitle('Home')
		}
	}, [pathname])

	return (
		<nav className='w-full h-14 flex justify-center items-center mt-2 bg-primary'>
			<div className='w-full max-w-[1200px] flex items-center justify-between px-6'>
				<Logo />

				<p className='text-xl font-semibold text-center text-accent'>
					{title}
				</p>
				<div className='cursor-pointer'>
					<SignedIn>
						<div className='flex gap-4 text-xs items-center justify-center'>
							<ProfileIcon />
						</div>
					</SignedIn>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
