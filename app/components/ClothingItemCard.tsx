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
	setIsEditing: (isEditing: boolean) => void
	item: {
		id: number
		image_file_name: string
	}
}

const ClothingItemCard = (props: Props) => {
	const { item, category } = props
	const [isEditing, setIsEditing] = useState(false)
	const [showEditButton, setShowEditButton] = useState(false)

	function handleEdit() {
		setIsEditing(true)
	}

	return (
		<>
			<div
				key={item.id}
				className='flex flex-col items-center justify-center hover:translate-y-[-4px] hover:shadow-lg w-[200px] transition-all duration-300 ease-in-out relative rounded-md bg-secondary'
				onMouseOver={() => setShowEditButton(true)}
				onMouseLeave={() => setShowEditButton(false)}
			>
				<div
					className={`absolute top-2 right-2 flex gap-2 ${
						showEditButton ? '' : 'hidden'
					}`}
				>
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
						width={160}
						height={160}
						className='inventory-image'
					/>
				</div>
				<p className='inventory-item-name'>{item.id}</p>
			</div>
			{isEditing && (
				<ClothingItemModal setIsEditing={setIsEditing} item={item} />
			)}
		</>
	)
}

function ClothingItemModal({ setIsEditing, item }: ClothingItemModalProps) {
	return (
		<div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
			<div className='bg-primary w-[320px] h-[500px] rounded-lg shadow-lg relative overflow-y-auto'>
				<button
					onClick={() => setIsEditing(false)}
					className='absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-accent text-white rounded-full shadow-md hover:scale-120 transition-transform duration-200 cursor-pointer'
				>
					✕
				</button>
				<div className='flex flex-col items-center justify-start h-full p-4 '>
					<div className='w-full h-40 flex justify-center items-center mt-8 mb-2'>
						<img
							src={`/assets/inverted-triangle/${item.image_file_name}`}
							alt={item.image_file_name}
							className='max-w-full max-h-full object-contain'
						/>
					</div>
					<p className='text-accent text-sm font-semibold uppercase tracking-wider'>
						{item.id}
					</p>
				</div>
			</div>
		</div>
	)
}

export default ClothingItemCard
