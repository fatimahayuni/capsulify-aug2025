import React, { useState } from 'react'
import CacheManager from '../../lib/CacheManager'
import ClothingItemModal from './ClothingItemModal'

type Props = {
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
	category: string
}



const ClothingItemCard = (props: Props) => {
	const { item } = props
	const [isEditing, setIsEditing] = useState(false)
	const [currentImage, setCurrentImage] = useState(item.image_file_name)
	const [currentName, setCurrentName] = useState(item.name)

	const handleEdit = () => setIsEditing(true)

	const handleSaveImage = (newImage: string) => {
		// Changing the fit item invalidates the fit/outfits cache.
		CacheManager.clearFitCache()
		CacheManager.clearOutfitsCache()

		setCurrentImage(newImage)
		setIsEditing(false)
	}

	const handleSaveName = (newName: string) => {
		setCurrentName(newName)
		setIsEditing(false)
	}

	return (
		<>
			<div
				key={item.id}
				className='flex flex-col items-center justify-center hover:translate-y-[-4px] hover:shadow-lg w-[200px] h-[220px] max-sm:w-[170px] max-sm:h-[185px] transition-all duration-300 ease-in-out relative rounded-md bg-secondary py-2'
			>
				<div className={`w-full flex px-2`}>
					<div className='flex gap-2 ml-auto mb-2 py-1'>
						<img
							src='/assets/icons/info.svg'
							className='w-[16px] h-[16px] p-1 rounded-full bg-[#4a342727]'
						/>
						<img
							src='/assets/icons/edit-pencil.svg'
							className='w-[16px] h-[16px] p-[3px] rounded-full bg-[#4a342727]'
							onClick={handleEdit}
						/>
					</div>
				</div>

				<div className='inventory-image-wrapper '>
					<img
						src={`/assets/inverted-triangle/${currentImage}`}
						alt={currentImage}
						className='inventory-image w-[135px] h-[135px] object-contain max-sm:w-[100px] max-sm:h-[100px]'
					/>
				</div>
				<p className='capitalize text-center text-[11px] mb-1 px-3'>
					{currentName}
				</p>
			</div>
			{isEditing && (
				<ClothingItemModal
					setIsEditing={setIsEditing}
					item={item}
					onSaveImage={handleSaveImage}
					onSaveName={handleSaveName}
				/>
			)}
		</>
	)
}



export default ClothingItemCard
