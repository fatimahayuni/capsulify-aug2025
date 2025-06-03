'use client'

import { useEffect, useState, useRef } from 'react'
import { Outfit, OutfitItem } from './types'
import OutfitCard from './components/OutfitCard'
import Pager from './components/Pager'
import Filter from './components/Filter'
import CacheManager from '@/app/lib/CacheManager'
import { getUserOutfitFavouriteKeys } from '@/app/lib/database/outfit'
import * as LoadingIcons from 'react-loading-icons'

export default function OutfitsPage() {
	const [outfits, setOutfits] = useState<Outfit[]>([])
	const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [filterItems, setFilterItems] = useState<OutfitItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [showSpinner, setShowSpinner] = useState(false)
	const [favoriteKeys, setFavoriteKeys] = useState<Set<string>>(new Set())
	const itemsPerPage = 18
	const contentRef = useRef<HTMLDivElement>(null)

	// Page load event.
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				// Load outfits and favorite keys in parallel
				const [outfitsData, favoriteKeysData] = await Promise.all([
					CacheManager.getUserOutfits(),
					getUserOutfitFavouriteKeys(),
				])

				if (outfitsData) {
					setOutfits(outfitsData)
					setFilteredOutfits(outfitsData)
				}

				// Convert array to Set for faster lookup
				setFavoriteKeys(new Set(favoriteKeysData))
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
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

	// Filter outfits when filter items change
	useEffect(() => {
		if (filterItems.length === 0) {
			setFilteredOutfits(outfits)
		} else {
			// Group filter items by category
			const filterItemsByCategory = filterItems.reduce(
				(acc, item) => {
					if (!acc[item.category_id]) {
						acc[item.category_id] = []
					}
					acc[item.category_id].push(item)
					return acc
				},
				{} as Record<number, OutfitItem[]>
			)

			const filtered = outfits.filter((outfit) => {
				// For each category in the filter, check if the outfit contains at least one item from that category
				return Object.entries(filterItemsByCategory).every(
					([categoryId, categoryItems]) => {
						// Within a category, it's an OR relationship - outfit needs to contain at least one of the selected items
						return categoryItems.some((filterItem) =>
							outfit.items.some(
								(outfitItem) =>
									outfitItem.clothing_variant_id ===
									filterItem.clothing_variant_id
							)
						)
					}
				)
			})
			setFilteredOutfits(filtered)
		}
		// Reset to first page when filter changes
		setCurrentPage(1)
	}, [filterItems, outfits])

	const handleFilterChange = (selectedItems: OutfitItem[]) => {
		setFilterItems(selectedItems)
	}

	// Calculate pagination
	const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentOutfits = filteredOutfits.slice(startIndex, endIndex)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		// Scroll to top of content area
		if (contentRef.current) {
			contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	// Handle favorite state changes from OutfitCard
	const handleFavoriteChange = (outfitKey: string, isFavorite: boolean) => {
		setFavoriteKeys((prev) => {
			const newSet = new Set(prev)
			if (isFavorite) {
				newSet.add(outfitKey)
			} else {
				newSet.delete(outfitKey)
			}
			return newSet
		})
	}

	if (isLoading && showSpinner) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] w-full'>
				<LoadingIcons.Oval stroke='#B9805A' height={60} width={60} />
				<span className='text-accent text-sm font-medium mt-4 animate-pulse'>
					Loading your outfits...
				</span>
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center w-full max-w-6xl mx-auto relative'>
			{/* Top Pager */}
			{totalPages > 1 && (
				<div className='w-full bg-primary sticky top-0 z-20'>
					<Pager
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			)}

			{/* Filter Component */}
			<Filter onFilterChange={handleFilterChange} />

			{/* Content area */}
			<div
				ref={contentRef}
				className='flex flex-col gap-8 overflow-y-scroll scrollbar-hide w-full px-4 max-sm:px-4 mt-6'
			>
				<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full max-w-[1600px] mx-auto'>
					{currentOutfits.map(
						(outfit: Outfit, outfitIndex: number) => (
							<div
								key={startIndex + outfitIndex}
								className='flex justify-center'
							>
								<OutfitCard
									outfit={outfit}
									favoriteKeys={favoriteKeys}
									onFavoriteChange={handleFavoriteChange}
								/>
							</div>
						)
					)}
				</div>
				<div className='h-[10rem] w-full'></div>
			</div>
		</div>
	)
}
