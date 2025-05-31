'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { OutfitItem } from '../types'
import { Category } from '@/app/constants/Category'
import Dropdown from '@/app/components/Dropdown'
import CacheManager from '@/app/lib/CacheManager'

interface FilterProps {
	onFilterChange: (filteredItems: OutfitItem[]) => void
}

interface ClothingItemData {
	clothing_variant_id: number
	category_id: number
	subcategory_id: number
	image_file_name: string
	name: string
}

const Filter = ({ onFilterChange }: FilterProps) => {
	const [selectedItems, setSelectedItems] = useState<OutfitItem[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [availableItems, setAvailableItems] = useState<ClothingItemData[]>([])
	const [loading, setLoading] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<number>(
		Category.Tops
	)

	const categoryOptions = [
		{ label: 'Tops', value: Category.Tops },
		{ label: 'Bottoms', value: Category.Bottoms },
		{ label: 'Dresses', value: Category.Dresses },
		{ label: 'Layers', value: Category.Layers },
		{ label: 'Bags', value: Category.Bags },
		{ label: 'Shoes', value: Category.Shoes },
	]

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
			const items = await CacheManager.getUserClothingItems()
			if (items) {
				setAvailableItems(items)
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
			name: item.name,
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

	// Handle category change
	const handleCategoryChange = (value: string | number) => {
		setSelectedCategory(Number(value))
	}

	const getFilteredItems = () => {
		const filtered = availableItems.filter(
			(item) => item.category_id === selectedCategory
		)
		return { [selectedCategory]: filtered }
	}

	return (
		<>
			{/* Filter Bar */}
			<div className='w-full sticky top-13 z-20 bg-primary px-3 pt-2 pb-1'>
				<div className='flex justify-center items-center max-w-xl py-2 px-2 mx-auto'>
					<div className='flex items-center hover:opacity-70 transition-opacity duration-200 mx-4'>
						{/* Add Button */}
						<button
							onClick={() => setIsModalOpen(true)}
							className='flex items-center gap-1 justify-center w-8 h-8 transition-colors cursor-pointer'
						>
							<img
								src='/assets/icons/filter-horizontal.svg'
								className='w-[60%] h-[60%] object-contain '
							/>
							<span className='text-[0.875rem] text-accent font-semibold cursor-pointer'>
								Filter
							</span>
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
								className='flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity duration-200 text-[0.7rem] bg-accent uppercase text-white rounded-sm px-8 py-2 cursor-pointer'
							>
								Apply
							</button>
						</div>

						{/* Modal Body */}
						<div className='p-4 overflow-y-auto h-[calc(80vh-120px)]'>
							{loading ? (
								<div className='flex items-center justify-center py-8'>
									<div className='text-accent opacity-80'>
										Loading clothing items...
									</div>
								</div>
							) : (
								<div className='space-y-6'>
									<Dropdown
										options={categoryOptions}
										value={selectedCategory}
										onChange={handleCategoryChange}
										placeholder='Select category'
										className='w-48'
									/>
									{Object.entries(getFilteredItems()).map(
										([categoryId, items]) => (
											<div
												key={categoryId}
												className='py-2'
											>
												<div className='flex flex-col gap-3'>
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
																onClick={() =>
																	addItemToFilter(
																		item
																	)
																}
																className={`flex items-center justify-between bg-secondary/70 hover:bg-secondary transition-colors cursor-pointer rounded-lg px-4 py-2 min-h-[48px] mb-3 relative ${
																	isSelected
																		? 'bg-[#e0d3c5]'
																		: 'bg-secondary'
																}`}
															>
																<span className='text-[0.75rem] w-[75%] text-accent'>
																	{item.name}
																</span>
																<img
																	src={`/assets/inverted-triangle/${item.image_file_name}`}
																	alt='Clothing item'
																	className='w-12 h-12 absolute right-2 bottom-4 object-contain ml-4 flex-shrink-0'
																/>
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
