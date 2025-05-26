'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { OutfitItem } from '../types'
import { getClothingItems } from '../actions'
import { Category } from '@/app/constants/Category'

interface FilterProps {
	onFilterChange: (filteredItems: OutfitItem[]) => void
}

interface ClothingItemData {
	clothing_variant_id: number
	category_id: number
	subcategory_id: number
	image_file_name: string
}

const Filter = ({ onFilterChange }: FilterProps) => {
	const [selectedItems, setSelectedItems] = useState<OutfitItem[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [availableItems, setAvailableItems] = useState<ClothingItemData[]>([])
	const [loading, setLoading] = useState(false)

	// Load available clothing items when modal opens
	useEffect(() => {
		if (isModalOpen && availableItems.length === 0) {
			loadClothingItems()
		}
	}, [isModalOpen])

	// Notify parent component when filter changes
	useEffect(() => {
		onFilterChange(selectedItems)
	}, [selectedItems, onFilterChange])

	const loadClothingItems = async () => {
		setLoading(true)
		try {
			// Check if items exist in localStorage first
			const storedItems = localStorage.getItem('clothingItems')

			if (storedItems) {
				setAvailableItems(JSON.parse(storedItems))
			} else {
				const items = await getClothingItems()
				if (items) {
					setAvailableItems(items)
					localStorage.setItem('clothingItems', JSON.stringify(items))
				}
			}
		} catch (error) {
			console.error('Error loading clothing items:', error)
		} finally {
			setLoading(false)
		}
	}

	const addItemToFilter = (item: ClothingItemData) => {
		const outfitItem: OutfitItem = {
			clothing_variant_id: item.clothing_variant_id,
			category_id: item.category_id,
			subcategory_id: item.subcategory_id,
			image_file_name: item.image_file_name,
		}

		// Check if item is already selected
		const isAlreadySelected = selectedItems.some(
			(selected) =>
				selected.clothing_variant_id === item.clothing_variant_id
		)

		if (!isAlreadySelected) {
			setSelectedItems([...selectedItems, outfitItem])
		} else {
			removeItemFromFilter(item.clothing_variant_id)
		}
	}

	const removeItemFromFilter = (itemId: number) => {
		setSelectedItems(
			selectedItems.filter((item) => item.clothing_variant_id !== itemId)
		)
	}

	const getCategoryName = (categoryId: number) => {
		const categoryNames: { [key: number]: string } = {
			[Category.Tops]: 'Tops',
			[Category.Bottoms]: 'Bottoms',
			[Category.Dresses]: 'Dresses',
			[Category.Layers]: 'Layers',
			[Category.Bags]: 'Bags',
			[Category.Shoes]: 'Shoes',
		}
		return categoryNames[categoryId] || 'Unknown'
	}

	const groupItemsByCategory = () => {
		const grouped: { [key: number]: ClothingItemData[] } = {}
		availableItems.forEach((item) => {
			if (!grouped[item.category_id]) {
				grouped[item.category_id] = []
			}
			grouped[item.category_id].push(item)
		})
		return grouped
	}

	return (
		<>
			{/* Filter Bar */}
			<div className='w-full sticky top-13 z-20 bg-primary px-3 pt-2 pb-1'>
				<div className='flex justify-center items-center max-w-4xl py-2 px-2 mx-auto'>
					<div className='  flex bg-secondary rounded-md p-1'>
						{/* Add Button */}
						<button
							onClick={() => setIsModalOpen(true)}
							className='flex items-center justify-center w-8 h-8 transition-colors cursor-pointer'
						>
							<img
								src='/assets/icons/filter-add.svg'
								className='w-[70%] h-[70%] object-contain hover:opacity-80 transition-opacity duration-200'
							/>
						</button>
					</div>

					{/* Selected Items */}
					<div className='flex items-center gap-2 flex-1 overflow-x-auto px-2'>
						{selectedItems.map((item) => (
							<div
								key={item.clothing_variant_id}
								className='relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 transition-colors'
								onClick={() =>
									removeItemFromFilter(
										item.clothing_variant_id
									)
								}
							>
								<img
									src={`/assets/inverted-triangle/${item.image_file_name}`}
									alt='Selected clothing item'
									className='w-full h-full object-contain'
								/>
								<div className='absolute inset-0 bg-opacity-0 hover:bg-opacity-10 transition-all' />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center'>
					{/* Backdrop */}
					<div
						className='absolute inset-0 bg-black/50'
						onClick={() => setIsModalOpen(false)}
					/>

					{/* Modal Content */}
					<div className='relative bg-primary rounded-lg shadow-xl max-w-4xl max-h-[80vh] w-full mx-6 overflow-hidden '>
						{/* Modal Header */}
						<div className='flex items-center justify-between p-4'>
							<h2 className='text-[0.9rem] font-semibold text-accent'>
								Filter By Category
							</h2>
							<button
								onClick={() => setIsModalOpen(false)}
								className='flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity duration-200'
							>
								<X
									size={16}
									className='text-accent w-5 h-5 cursor-pointer'
								/>
							</button>
						</div>

						{/* Modal Body */}
						<div className='p-4 overflow-y-auto max-h-[calc(80vh-120px)]'>
							{loading ? (
								<div className='flex items-center justify-center py-8'>
									<div className='text-accent opacity-80'>
										Loading clothing items...
									</div>
								</div>
							) : (
								<div className='space-y-6'>
									{Object.entries(groupItemsByCategory()).map(
										([categoryId, items]) => (
											<div
												key={categoryId}
												className='py-2'
											>
												<h3 className='text-[0.8rem] font-medium text-accent mb-3 bg-secondary rounded-sm p-1 px-8 text-center w-fit mx-auto'>
													{getCategoryName(
														Number(categoryId)
													)}
												</h3>
												<div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-3 place-items-center'>
													{items.map((item) => {
														const isSelected =
															selectedItems.some(
																(selected) =>
																	selected.clothing_variant_id ===
																	item.clothing_variant_id
															)
														return (
															<div
																key={
																	item.clothing_variant_id
																}
																className={`relative w-16 h-16 rounded-lg p-1 overflow-hidden cursor-pointer transition-all ${
																	isSelected
																		? 'bg-secondary'
																		: ''
																}`}
																onClick={() =>
																	addItemToFilter(
																		item
																	)
																}
															>
																<img
																	src={`/assets/inverted-triangle/${item.image_file_name}`}
																	alt='Clothing item'
																	className='w-full h-full object-contain'
																/>
																{isSelected && (
																	<div className='absolute inset-0 bg-opacity-20' />
																)}
															</div>
														)
													})}
												</div>
											</div>
										)
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Filter
