'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Navbar from '@/app/components/Navbar'
import { FaHeart } from 'react-icons/fa'

export default function HomePage() {
	// get username from clerk
	const { user } = useUser()
	const [username, setUsername] = useState<string | null>(null)

	useEffect(() => {
		if (user) {
			setUsername(user.username)
		}
	}, [user])

	return (
		<div className='bg-primary flex flex-col relative'>
			<Navbar />
			<main className='flex-1 flex flex-col items-center px-4 pt-4 pb-32'>
				<div className='w-full max-w-xs mx-auto text-center mt-2'>
					<p className='text-[1rem] text-accent font-normal mb-1 text-left'>
						Hi,{' '}
						<span className='font-bold capitalize'>
							{username ? username : '---'}
						</span>
						<span>👋</span>{' '}
						<span className='text-[1.1rem] text-accent font-medium mb-4 text-left block leading-12'>
							Welcome Back!
						</span>
					</p>

					{/* <p className='text-[0.875rem] text-accent font-normal mb-6 mt-6 text-left leading-6 w-[90%]'>
						You have{' '}
						<span className='font-bold text-[1.1rem]'>
							{outfitCount.toLocaleString()}
						</span>
						{'  '}
						looks awaiting you.
					</p> */}
					<p className='text-[0.9rem] text-accent font-semibold mb-6 mt-6 text-left flex items-center gap-2'>
						<FaHeart />
						Your Latest Favorites
					</p>
				</div>
			</main>
		</div>
	)
}
