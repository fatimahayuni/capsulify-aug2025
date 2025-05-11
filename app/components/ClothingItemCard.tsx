import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa'

type Props = {
	item: {
		id: number
		image_file_name: string
	}
	category: string
}

type ClothingItemModalProps = {
	isEditing: boolean
	setIsEditing: (isEditing: boolean) => void
}

const ClothingItemCard = (props: Props) => {
	const { item, category } = props
	const [isEditing, setIsEditing] = useState(false)

	function handleEdit() {
		setIsEditing(true)
	}

	return (
		<div key={item.id} className='inventory-item'>
			<div className='inventory-item-icons top-right'>
				<FaEdit
					className='inventory-item-icon'
					onClick={() => {
						handleEdit()
					}}
				/>
			</div>

			<div className='inventory-image-wrapper'>
				<img
					src={`/assets/inverted-triangle/${item.image_file_name}`}
					alt={item.image_file_name}
					className='inventory-image'
				/>
			</div>
			<p className='inventory-item-name'>{item.id}</p>

			<ClothingItemModal
				isEditing={isEditing}
				setIsEditing={setIsEditing}
			/>
		</div>
	)
}

function ClothingItemModal({
	isEditing,
	setIsEditing,
}: ClothingItemModalProps) {
	return (
		<div
			className={`max-w-md max-h-72 bg-primary fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${
				isEditing ? `flex` : `hidden`
			} z-50`}
		>
			ClothingItemModal
		</div>
	)
}

export default ClothingItemCard
