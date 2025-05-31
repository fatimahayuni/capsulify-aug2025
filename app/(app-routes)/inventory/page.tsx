'use client'
import { useState, useEffect, useRef } from 'react'
import { CATEGORIES } from '@/app/constants/utils'
import ClothingItemCard from '@/app/(app-routes)/inventory/ClothingItemCard'
import { useAuth } from '@clerk/nextjs'
import CacheManager from '@/app/lib/CacheManager'
import * as LoadingIcons from 'react-loading-icons'

export default function InventoryPage() {
	const [fit, setFit] = useState<any>({})
	const [isLoading, setIsLoading] = useState(true)
	const [showSpinner, setShowSpinner] = useState(false)
	const { userId: clerkId } = useAuth()

	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
	const [activeSection, setActiveSection] = useState<string | null>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.getAttribute('data-key'))
					}
				})
			},
			{
				root: null,
				// Offset top half of viewport so section triggers when past midpoint
				rootMargin: '-50% 0px -50% 0px',
				threshold: 0, // We don't need a percent threshold when rootMargin does the job
			}
		)

		Object.keys(CATEGORIES).forEach((key) => {
			const section = sectionRefs.current[key]
			if (section) observer.observe(section)
		})

		return () => {
			Object.keys(CATEGORIES).forEach((key) => {
				const section = sectionRefs.current[key]
				if (section) observer.unobserve(section)
			})
		}
	}, [])

	useEffect(() => {
		let spinnerTimeout: NodeJS.Timeout
		if (isLoading) {
			spinnerTimeout = setTimeout(() => setShowSpinner(true), 100)
		} else {
			setShowSpinner(false)
		}
		return () => clearTimeout(spinnerTimeout)
	}, [isLoading])

	// Page load event.
	useEffect(() => {
		const fetchFit = async () => {
			if (!clerkId) return
			setIsLoading(true)
			try {
				const currentUsersFit = await CacheManager.getUserClothingItems()

				// Group items by category
				const groupedByCategory = (currentUsersFit || []).reduce((acc: any, item: any) => {
					const category = item.category_id
					if (!acc[category]) {
						acc[category] = []
					}
					acc[category].push(item)
					return acc
				}, {})

				console.log(groupedByCategory)
				
				setFit(groupedByCategory)
			} finally {
				setIsLoading(false)
			}
		}
		fetchFit()
	}, [clerkId])

	const scrollToSection = (key: string) => {
		const section = sectionRefs.current[key]
		if (section) {
			section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
			setActiveSection(key)
		}
	}

	if (isLoading && showSpinner) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] w-full'>
				<LoadingIcons.Oval stroke='#B9805A' height={60} width={60} />
				<span className='text-accent text-sm font-medium mt-4 animate-pulse'>
					Loading your wardrobe...
				</span>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-6 items-center w-full max-w-6xl mx-auto mt-4 px-4 max-sm:px-2 relative'>
			<div className='flex flex-col gap-4 items-center w-full max-w-6xl mx-auto sticky top-0 z-10 bg-primary py-4'>
				{/* Scroll Buttons */}
				<div className='flex gap-2 justify-start sm:justify-center text-[12px] overflow-x-auto w-full scrollbar-hide px-2'>
					{Object.entries(CATEGORIES).map(([key, value]) => (
						<button
							key={key}
							onClick={() => scrollToSection(key)}
							className={`flex-shrink-0 px-4 py-2 rounded-lg transition ${
								activeSection === key
									? 'bg-accent text-white'
									: 'bg-primary text-[#4b3621] border border-[#d3cfc9]'
							}`}
						>
							{value}
						</button>
					))}
				</div>
			</div>

			{/* Sections */}
			<div className='flex flex-col gap-8 overflow-y-scroll scrollbar-hide w-full'>
				{Object.entries(CATEGORIES).map(([key, value]) => {
					const items = fit[key] || []
					return (
						<div
							key={key}
							ref={(el) => {
								sectionRefs.current[key] = el
							}}
							className='w-full scroll-mt-[75px] '
							data-key={key}
						>
							<div className='flex flex-wrap justify-center space-x-2 space-y-2 w-full text-sm mb-8'>
								{items.map((item: any) => (
									<ClothingItemCard
										key={item.id}
										item={item}
										category={key}
									/>
								))}
							</div>
						</div>
					)
				})}
				<div className='h-[10rem] w-full'></div>
			</div>
		</div>
	)
}
