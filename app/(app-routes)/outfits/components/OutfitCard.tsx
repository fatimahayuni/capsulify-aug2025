import { SubCategory } from '@/app/constants/SubCategory'
import { Category } from '@/app/constants/Category'
import { Outfit, OutfitGroupType, OutfitItem } from '../types'
import { useEffect, useState, useRef, useCallback } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { saveOutfitFavourite, deleteOutfitFavourite, OutfitFavourite } from '@/app/lib/database/outfit'

type Props = {
	outfit: Outfit
	favoriteKeys: Set<string>
	onFavoriteChange: (outfitKey: string, isFavorite: boolean) => void
}

const OutfitCard = (props: Props) => {
	const { outfit, favoriteKeys, onFavoriteChange } = props
	const [isFavorite, setIsFavorite] = useState(false)
	const isInitialized = useRef(false)
	const isProcessing = useRef(false)

	// Helper function to convert Outfit to OutfitFavourite format
	const convertToOutfitFavourite = (outfit: Outfit): OutfitFavourite => {
		const outfitFav: OutfitFavourite = {
			top_variant_id: null,
			bottom_variant_id: null,
			dress_variant_id: null,
			layer_variant_id: null,
			bag_variant_id: null,
			shoe_variant_id: null,
		}

		outfit.items.forEach(item => {
			switch (item.category_id) {
				case Category.Tops:
					outfitFav.top_variant_id = item.clothing_variant_id
					break
				case Category.Bottoms:
					outfitFav.bottom_variant_id = item.clothing_variant_id
					break
				case Category.Dresses:
					outfitFav.dress_variant_id = item.clothing_variant_id
					break
				case Category.Layers:
					outfitFav.layer_variant_id = item.clothing_variant_id
					break
				case Category.Bags:
					outfitFav.bag_variant_id = item.clothing_variant_id
					break
				case Category.Shoes:
					outfitFav.shoe_variant_id = item.clothing_variant_id
					break
			}
		})

		return outfitFav
	}

	// Helper function to generate outfit key
	const generateOutfitKey = (outfitFav: OutfitFavourite): string => {
		return [
			outfitFav.top_variant_id ?? 0,
			outfitFav.bottom_variant_id ?? 0,
			outfitFav.dress_variant_id ?? 0,
			outfitFav.layer_variant_id ?? 0,
			outfitFav.bag_variant_id ?? 0,
			outfitFav.shoe_variant_id ?? 0
		].join('-')
	}

	// Initialize favorite state only once based on favoriteKeys
	useEffect(() => {
		if (isInitialized.current) return
		
		const outfitFav = convertToOutfitFavourite(outfit)
		const outfitKey = generateOutfitKey(outfitFav)
		setIsFavorite(favoriteKeys.has(outfitKey))
		isInitialized.current = true
	}, [favoriteKeys, outfit])

	// Handle favorite toggle
	const handleFavoriteToggle = useCallback(async () => {
		if (isProcessing.current) return
		
		isProcessing.current = true
		const newFavoriteState = !isFavorite
		setIsFavorite(newFavoriteState)

		try {
			const outfitFav = convertToOutfitFavourite(outfit)
			const outfitKey = generateOutfitKey(outfitFav)

			if (newFavoriteState) {
				await saveOutfitFavourite(outfitFav)
			} else {
				await deleteOutfitFavourite(outfitKey)
			}

			// Notify parent component of the change
			onFavoriteChange(outfitKey, newFavoriteState)
		} catch (error) {
			console.error('Error updating favorite:', error)
			// Revert state on error
			setIsFavorite(!newFavoriteState)
		} finally {
			isProcessing.current = false
		}
	}, [isFavorite, outfit, onFavoriteChange])

	// Group type flags.
	const isTopBottomLayerBagShoes =
		outfit.grouptype_id === OutfitGroupType.TopBottomLayerBagShoes
	const isDressLayerBagShoes =
		outfit.grouptype_id === OutfitGroupType.DressLayerBagShoes
	const isTopBottomBagShoes =
		outfit.grouptype_id === OutfitGroupType.TopBottomBagShoes
	const isDressBagShoes =
		outfit.grouptype_id === OutfitGroupType.DressBagShoes

	// Subcategory flags.
	const isTopBottomBagShoes_WithSkirt =
		outfit.items.some(
			(item) =>
				item.subcategory_id === SubCategory.CasualSkirt ||
				item.subcategory_id === SubCategory.TailoredSkirt
		) && outfit.grouptype_id === OutfitGroupType.TopBottomBagShoes

	const isTopBottomBagShoes_WithShorts =
		outfit.items.some(
			(item) => item.subcategory_id === SubCategory.CasualShorts
		) && outfit.grouptype_id === OutfitGroupType.TopBottomBagShoes

	const isTopBottomLayerBagShoes_WithShorts =
		outfit.items.some(
			(item) => item.subcategory_id === SubCategory.CasualShorts
		) && outfit.grouptype_id === OutfitGroupType.TopBottomLayerBagShoes

	const isTopBottomLayerBagShoes_WithSkirt =
		outfit.items.some(
			(item) =>
				item.subcategory_id === SubCategory.CasualSkirt ||
				item.subcategory_id === SubCategory.TailoredSkirt
		) && outfit.grouptype_id === OutfitGroupType.TopBottomLayerBagShoes

	const getItemLayoutClasses = (item: OutfitItem) => {
		const defaultBags =
			'absolute top-1/2 left-1 w-12 h-12 z-[1] -translate-y-1/2'
		const defaultShoes = 'absolute bottom-1 right-4 w-10 h-10 z-[1]'
		const defaultLayers = 'absolute top-4 right-3 w-20 h-20 z-[2]'

		if (isTopBottomBagShoes) {
			if (isTopBottomBagShoes_WithShorts) {
				switch (item.category_id) {
					case Category.Tops:
						return 'absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-25 h-25 z-[3]'
					case Category.Bottoms:
						return 'absolute top-4/10 left-1/2 -translate-x-[calc(50%+2px)] w-18 h-18 z-[4]'
					case Category.Bags:
						return defaultBags
					case Category.Shoes:
						return defaultShoes
				}
			} else if (isTopBottomBagShoes_WithSkirt) {
				switch (item.category_id) {
					case Category.Tops:
						return 'absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-25 h-25 z-[3]'
					case Category.Bottoms:
						return 'absolute top-4/10 left-1/2 -translate-x-[calc(50%+1px)] w-22 h-22 z-[4]'
					case Category.Bags:
						return defaultBags
					case Category.Shoes:
						return defaultShoes
				}
			} else {
				// Other bottom types such as Pants, Jeans.
				switch (item.category_id) {
					case Category.Tops:
						return 'absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 z-[3]'
					case Category.Bottoms:
						return 'absolute top-3/10 left-1/2 -translate-x-[calc(50%+1px)] w-35 h-35 z-[4]'
					case Category.Bags:
						return defaultBags
					case Category.Shoes:
						return defaultShoes
				}
			}
		}

		if (isTopBottomLayerBagShoes) {
			if (isTopBottomLayerBagShoes_WithShorts) {
				switch (item.category_id) {
					case Category.Tops:
						return 'absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-25 h-25 z-[3]'
					case Category.Bottoms:
						return 'absolute top-4/10 left-1/2 -translate-x-[calc(50%+3px)] w-18 h-18 z-[4]'
					case Category.Layers:
						return defaultLayers
					case Category.Bags:
						return defaultBags
					case Category.Shoes:
						return defaultShoes
				}
			} else if (isTopBottomLayerBagShoes_WithSkirt) {
				switch (item.category_id) {
					case Category.Tops:
						return 'absolute top-1/10 left-1/2 -translate-x-[calc(50%+1px)] w-22 h-22 z-[3]'
					case Category.Bottoms:
						return 'absolute top-4/11 left-1/2 -translate-x-[calc(50%+2px)] w-26 h-26 z-[4]'
					case Category.Layers:
						return 'absolute top-4 right-3 w-18 h-18 z-[2]'
					case Category.Bags:
						return defaultBags
					case Category.Shoes:
						return defaultShoes
				}
			} else {
				// Other bottom types such as Pants, Jeans.
				switch (item.category_id) {
					case Category.Tops:
						return 'absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 z-[3]'
					case Category.Bottoms:
						return 'absolute top-3/10 left-1/2 -translate-x-[calc(50%+1px)] w-35 h-35 z-[4]'
					case Category.Layers:
						return defaultLayers
					case Category.Bags:
						return defaultBags
					case Category.Shoes:
						return defaultShoes
				}
			}
		}

		if (isDressLayerBagShoes) {
			switch (item.category_id) {
				case Category.Dresses:
					return 'absolute top-0 left-0 w-full h-full z-[3]'
				case Category.Layers:
					return 'absolute top-10 right-2 w-20 h-20 z-[2]'
				case Category.Bags:
					return defaultBags
				case Category.Shoes:
					return defaultShoes
			}
		}

		if (isDressBagShoes) {
			switch (item.category_id) {
				case Category.Dresses:
					return 'absolute top-0 left-0 w-full h-full z-[3]'
				case Category.Bags:
					return defaultBags
				case Category.Shoes:
					return defaultShoes
			}
		}

		console.log('No match found for item!')
		return ''
	}

	return (
		<div className='w-[400px] h-[300px] max-sm:w-[160px] max-sm:h-[220px] transition-all duration-300 ease-in-out relative rounded-md bg-secondary py-4 px-4 mx-auto'>
			{/* Favorite Heart Icon */}
			<button
				aria-label='Favorite outfit'
				className='absolute top-2 right-2 text-accent hover:scale-110 transition-all text-md rounded-full p-1 cursor-pointer z-[10]'
				onClick={handleFavoriteToggle}
			>
				{isFavorite ? <FaHeart /> : <FaRegHeart />}
			</button>
			{outfit.items.map((item, index) => {
				const classes = getItemLayoutClasses(item)
				return (
					<div
						key={`${item.clothing_variant_id}-${index}`}
						className={classes}
					>
						<img
							src={`/assets/inverted-triangle/${item.image_file_name}`}
							alt={item.image_file_name}
							className='w-full h-full object-contain'
						/>
					</div>
				)
			})}
		</div>
	)
}

export default OutfitCard
