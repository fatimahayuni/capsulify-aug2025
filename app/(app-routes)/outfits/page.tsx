'use client'

import { useEffect, useState, useRef } from 'react'
import { getOutfits } from './actions'
import { Outfit, OutfitItem } from './types'
import OutfitCard from './components/OutfitCard'
import Pager from './components/Pager'
import Filter from './components/Filter'

export default function OutfitsPage() {
	const [outfits, setOutfits] = useState<Outfit[]>([])
	const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [filterItems, setFilterItems] = useState<OutfitItem[]>([])
	const itemsPerPage = 18
	const contentRef = useRef<HTMLDivElement>(null)

	// Page load event.
	useEffect(() => {
		const fetchOutfits = async () => {
			// Check if outfits exist in localStorage
			const storedOutfits = localStorage.getItem('outfits')

			if (storedOutfits) {
				const outfitsData = JSON.parse(storedOutfits)
				setOutfits(outfitsData)
				setFilteredOutfits(outfitsData)
			} else {
				const data = await getOutfits()
				if (data) {
					setOutfits(data)
					setFilteredOutfits(data)
					localStorage.setItem('outfits', JSON.stringify(data))
				}
			}
		}
		fetchOutfits()
	}, [])

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

	return (
		<div className='flex flex-col items-center w-full max-w-6xl mx-auto relative'>
			{/* Top Pager */}
			{totalPages > 1 && (
				<div className='w-full bg-primary sticky top-0 z-20 pt-2'>
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
				className='flex flex-col gap-8 overflow-y-scroll scrollbar-hide w-full px-4 max-sm:px-4 mt-4'
			>
				<div className='flex flex-wrap justify-center space-x-2 space-y-3 w-full text-sm mb-8'>
					{currentOutfits.map(
						(outfit: Outfit, outfitIndex: number) => (
							<OutfitCard
								key={startIndex + outfitIndex}
								outfit={outfit}
							/>
						)
					)}
				</div>
				<div className='h-[10rem] w-full'></div>
			</div>
		</div>
	)
}
