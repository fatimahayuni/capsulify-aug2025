import React, { useEffect, useState } from 'react'
import { EDIT_OPTIONS, toTitleCase } from '../../constants/utils'
import { saveClothingVariantId } from '../../lib/actions/clothingItems.actions'
import { getUserByClerkId } from '../../lib/actions/user.actions'
import { useAuth } from '@clerk/nextjs'
import CacheManager from '../../lib/CacheManager'

type ClothingVariant = {
	id: number
	image_file_name: string
	name: string
	top_sleeve_type_id: number | null
	blouse_sleeve_type_id: number | null
	neckline_id: number | null
	dress_cut_id: number | null
	bottom_cut_id: number | null
	short_cut_id: number | null
	skirt_cut_id: number | null
}

type ClothingItemModalProps = {
	setIsEditing: (isEditing: boolean) => void
	item: {
		id: number
		subcategory_id: number
		image_file_name: string
		top_sleeve_type_id: number | null
		blouse_sleeve_type_id: number | null
		neckline_id: number | null
		dress_cut_id: number | null
		bottom_cut_id: number | null
		short_cut_id: number | null
		skirt_cut_id: number | null
		clothing_variant_id: number
		colour_type_id: number
		name: string
	}
	onSaveImage: (newImage: string) => void
	onSaveName: (newName: string) => void
}

function ClothingItemModal({
	setIsEditing,
	item,
	onSaveImage,
	onSaveName,
}: ClothingItemModalProps) {
	const { userId: clerkId } = useAuth()

	const [options, setOptions] = useState({
		top_sleeve_type_id: item.top_sleeve_type_id,
		blouse_sleeve_type_id: item.blouse_sleeve_type_id,
		neckline_id: item.neckline_id,
		dress_cut_id: item.dress_cut_id,
		bottom_cut_id: item.bottom_cut_id,
		short_cut_id: item.short_cut_id,
		skirt_cut_id: item.skirt_cut_id,
	})

	const [image, setImage] = useState(item.image_file_name)
	const [name, setName] = useState(item.name)
	const [clothingVariantId, setClothingVariantId] = useState(
		item.clothing_variant_id
	)
	const [allVariants, setAllVariants] = useState<ClothingVariant[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const prevClothingVariantId = item.clothing_variant_id

	// Load all variants on mount
	useEffect(() => {
		const loadAllVariants = async () => {
			try {
				setIsLoading(true)
				const variants = await CacheManager.getVariantsForSubcategoryAndColor(
					item.subcategory_id,
					item.colour_type_id
				)
				setAllVariants(variants)
			} catch (error) {
				console.error('Error loading variants:', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadAllVariants()
	}, [item.subcategory_id, item.colour_type_id])

	// Find matching variant from preloaded data
	const findMatchingVariant = (currentOptions: typeof options) => {
		return allVariants.find((variant) => {
			return (
				variant.top_sleeve_type_id === currentOptions.top_sleeve_type_id &&
				variant.blouse_sleeve_type_id === currentOptions.blouse_sleeve_type_id &&
				variant.neckline_id === currentOptions.neckline_id &&
				variant.dress_cut_id === currentOptions.dress_cut_id &&
				variant.bottom_cut_id === currentOptions.bottom_cut_id &&
				variant.short_cut_id === currentOptions.short_cut_id &&
				variant.skirt_cut_id === currentOptions.skirt_cut_id
			)
		})
	}

	// Update display when options change
	useEffect(() => {
		if (allVariants.length > 0) {
			const matchingVariant = findMatchingVariant(options)
			if (matchingVariant) {
				setImage(matchingVariant.image_file_name)
				setName(matchingVariant.name)
				setClothingVariantId(matchingVariant.id)
			} else {
				console.warn('No matching variant found for options:', options)
			}
		}
	}, [options, allVariants])

	const handleSave = async () => {
		const user = await getUserByClerkId(clerkId!)
		await saveClothingVariantId(
			Number(user.id),
			clothingVariantId,
			prevClothingVariantId
		)
		
		// Clear the fit cache since we've modified the user's wardrobe
		CacheManager.clearFitCache()
		
		onSaveImage(image) // Update the parent with new image
		onSaveName(name)
		setIsEditing(false) // Close the modal after saving
	}

	//@ts-ignore
	const editOptions = EDIT_OPTIONS[item.subcategory_id]
	const [activeClass, setActiveClass] = useState(Object.keys(editOptions)[0])

	return (
		<div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 w-full h-full'>
			<div className='bg-primary w-[350px] h-[625px] rounded-lg shadow-lg relative overflow-y-auto'>
				<button
					onClick={() => setIsEditing(false)}
					className='absolute top-2 right-2 w-8 h-8 flex items-center justify-center  text-amber-950 rounded-full  hover:scale-120 transition-transform duration-200 cursor-pointer'
				>
					✕
				</button>

				{isLoading ? (
					<div className='flex items-center justify-center h-full'>
						<div className='text-accent text-sm'>Loading variants...</div>
					</div>
				) : (
					<>
						<div className='flex flex-col items-center justify-start p-4 '>
							<div className='w-full h-40 flex justify-center items-center mt-8 mb-2'>
								{/* Item Image */}
								<img
									src={`/assets/inverted-triangle/${image}`}
									alt={image}
									className='w-[135px] h-[135px] object-contain'
								/>
							</div>
							<p className='text-accent text-sm capitalize text-center px-4'>
								{/* Item Name */}
								{name}
							</p>
						</div>

						<div className='p-2 mt-4 '>
							<div className='flex items-center justify-center font-semibold text-sm gap-2'>
								{Object.keys(editOptions).map((key) => (
									<div
										key={key}
										className={`px-4 py-2 cursor-pointer text-accent ${
											activeClass === key
												? 'border-b-2 border-b-accent '
												: 'border-b-2 border-transparent'
										}`}
										onClick={() => setActiveClass(key)}
									>
										{toTitleCase(key)}
									</div>
								))}
							</div>
							{
								// @ts-ignore
								Object.entries(EDIT_OPTIONS[item.subcategory_id]).map(
									([key, value]) => (
										<div
											key={key}
											className={
												activeClass === key
													? 'flex flex-col items-start mb-4'
													: 'hidden'
											}
										>
											<div className='flex flex-col items-start justify-center text-sm w-fit mx-10 mt-4'>
												{/* @ts-ignore */}
												{value.options.map(
													(option: {
														id: number
														name: string
													}) => (
														<label
															key={option.id}
															className='flex items-center space-x-2 mb-2 text-[#4b3621] font-medium '
														>
															<input
																type='radio'
																// @ts-ignore
																name={value.name}
																value={option.id}
																// @ts-ignore
																checked={
																	// @ts-ignore
																	options[
																		// @ts-ignore
																		value.name
																	] === option.id
																}
																onChange={() =>
																	setOptions(
																		(prev) => ({
																			...prev,
																			// @ts-ignore
																			[value.name]:
																				option.id,
																		})
																	)
																}
																className='appearance-none w-4 h-4 border-2 border-[#4b3621] rounded-full checked:bg-[#4b3621] checked:border-[#4b3621] transition-colors duration-200'
															/>
															<span>{option.name}</span>
														</label>
													)
												)}
											</div>
										</div>
									)
								)}
						</div>

						<div className='flex justify-end mt-4 text-sm px-4 mr-4'>
							<button
								onClick={handleSave}
								className='bg-accent text-white px-6 py-2 rounded-md shadow-md hover:scale-105 transition-transform duration-200'
							>
								Save
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default ClothingItemModal 