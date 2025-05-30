'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

const outfitImages = [
	'/assets/images/clothing-variations/rectangle/tops/black-satin-top.png',
	'/assets/images/clothing-variations/rectangle/bottoms/taupe-tailored-pants.png',
	'/assets/images/layers/beige-blazer.png',
	'/assets/images/bags/black-tote.png',
	'/assets/images/shoes/gold-strappy-sandals.png',
]

export default function HomePage() {
	// get username from clerk
	const { user } = useUser()
	const [username, setUsername] = useState<string | null>(null)
	const [outfitCount, setOutfitCount] = useState(0)

	useEffect(() => {
		if (user) {
			setUsername(user.username)
		}
	}, [user])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const outfits = JSON.parse(localStorage.getItem('outfits') || '[]')
			setOutfitCount(outfits.length)
		}
	}, [])

	return (
		<div className='bg-primary flex flex-col relative'>
			<main className='flex-1 flex flex-col items-center px-4 pt-4 pb-32'>
				<div className='w-full max-w-xs mx-auto text-center mt-2'>
					<p className='text-[1rem] text-accent font-normal mb-1 text-left'>
						Hi,{' '}
						<span className='font-bold capitalize'>
							{username ? username : '---'}
						</span>
						<span>👋</span>
						<span className='text-[1.1rem] text-accent font-medium mb-4 text-left'>
							Welcome Back!
						</span>
					</p>

					<p className='text-[0.875rem] text-accent font-normal mb-6 mt-6 text-left leading-6 w-[90%]'>
						You have{' '}
						<span className='font-bold text-[1.1rem]'>
							{outfitCount}
						</span>
						{'  '}
						more looks awaiting you.
					</p>
					<p className='text-[0.9rem] text-accent font-semibold mb-6 mt-6 text-left'>
						This was your most recent fashion moment!
					</p>
					<div className='bg-secondary rounded-md py-4 px-4 mx-auto w-[200px] h-[220px] max-sm:w-[160px] max-sm:h-[220px] relative transition-all duration-300 ease-in-out'>
						{/* Blazer (Layer) */}
						<img
							src={outfitImages[2]}
							alt='Blazer'
							className='absolute top-5 right-4 w-20 h-20 z-[2]'
						/>
						{/* Top */}
						<img
							src={outfitImages[0]}
							alt='Top'
							className='absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-18 h-18 z-[3]'
						/>
						{/* Pants (Bottom) */}
						<img
							src={outfitImages[1]}
							alt='Pants'
							className='absolute top-3/10 left-1/2 -translate-x-[calc(50%+1px)] w-30 h-30 z-[4]'
						/>
						{/* Bag */}
						<img
							src={outfitImages[3]}
							alt='Bag'
							className='absolute top-1/2 left-1 w-12 h-12 z-[1] -translate-y-1/2'
						/>
						{/* Shoes */}
						<img
							src={outfitImages[4]}
							alt='Shoes'
							className='absolute bottom-1 right-4 w-10 h-10 z-[1]'
						/>
					</div>
					<div className='flex justify-center mt-6'>
						<Link href='/outfits'>
							<button className='bg-accent text-white px-8 py-2 rounded-md shadow-md hover:bg-accent-2 transition-colors font-semibold text-[0.65rem]'>
								Explore More Outfits
							</button>
						</Link>
					</div>
				</div>
			</main>
		</div>
	)
}
