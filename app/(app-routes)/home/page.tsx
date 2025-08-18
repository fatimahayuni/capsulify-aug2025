'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Navbar from '@/app/components/Navbar'
import { FaHeart } from 'react-icons/fa'
import CacheManager from '@/app/lib/CacheManager'
import {
	getUserOutfitFavouriteKeys,
	OutfitFavourite,
} from '@/app/lib/database/outfit'
import OutfitCard from '../outfits/components/OutfitCard'
import { Outfit } from '../outfits/types'

export default function HomePage() {
	// get username from clerk
	const { user } = useUser()
	const [username, setUsername] = useState<string | null>(null)
	const [favoriteKeys, setFavoriteKeys] = useState<Set<string>>(new Set())
	const [outfits, setOutfits] = useState<Outfit[]>([])
	const [favoriteOutfits, setFavoriteOutfits] = useState<Outfit[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchFavorites = async () => {
			setIsLoading(true)
			try {
				const [allOutfits, favKeys] = await Promise.all([
					CacheManager.getUserOutfits(),
					getUserOutfitFavouriteKeys(),
				])
				setOutfits(allOutfits || [])
				const favKeySet = new Set(favKeys)
				setFavoriteKeys(favKeySet)
				if (allOutfits && favKeys) {
					const favs = allOutfits.filter((outfit: Outfit) => {
						const outfitFav: OutfitFavourite = {
							top_variant_id: null,
							bottom_variant_id: null,
							dress_variant_id: null,
							layer_variant_id: null,
							bag_variant_id: null,
							shoe_variant_id: null,
						}
						outfit.items.forEach((item) => {
							switch (item.category_id) {
								case 1:
									outfitFav.top_variant_id =
										item.clothing_variant_id
									break
								case 2:
									outfitFav.bottom_variant_id =
										item.clothing_variant_id
									break
								case 3:
									outfitFav.dress_variant_id =
										item.clothing_variant_id
									break
								case 4:
									outfitFav.layer_variant_id =
										item.clothing_variant_id
									break
								case 5:
									outfitFav.bag_variant_id =
										item.clothing_variant_id
									break
								case 6:
									outfitFav.shoe_variant_id =
										item.clothing_variant_id
									break
							}
						})
						const key = [
							outfitFav.top_variant_id ?? 0,
							outfitFav.bottom_variant_id ?? 0,
							outfitFav.dress_variant_id ?? 0,
							outfitFav.layer_variant_id ?? 0,
							outfitFav.bag_variant_id ?? 0,
							outfitFav.shoe_variant_id ?? 0,
						].join('-')
						return favKeySet.has(key)
					})
					setFavoriteOutfits(favs)
				}
			} finally {
				setIsLoading(false)
			}
		}
		fetchFavorites()
	}, [])

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
		setFavoriteOutfits(
			outfits.filter((outfit: Outfit) => {
				const outfitFav: OutfitFavourite = {
					top_variant_id: null,
					bottom_variant_id: null,
					dress_variant_id: null,
					layer_variant_id: null,
					bag_variant_id: null,
					shoe_variant_id: null,
				}
				outfit.items.forEach((item) => {
					switch (item.category_id) {
						case 1:
							outfitFav.top_variant_id = item.clothing_variant_id
							break
						case 2:
							outfitFav.bottom_variant_id =
								item.clothing_variant_id
							break
						case 3:
							outfitFav.dress_variant_id =
								item.clothing_variant_id
							break
						case 4:
							outfitFav.layer_variant_id =
								item.clothing_variant_id
							break
						case 5:
							outfitFav.bag_variant_id = item.clothing_variant_id
							break
						case 6:
							outfitFav.shoe_variant_id = item.clothing_variant_id
							break
					}
				})
				const key = [
					outfitFav.top_variant_id ?? 0,
					outfitFav.bottom_variant_id ?? 0,
					outfitFav.dress_variant_id ?? 0,
					outfitFav.layer_variant_id ?? 0,
					outfitFav.bag_variant_id ?? 0,
					outfitFav.shoe_variant_id ?? 0,
				].join('-')
				return favoriteKeys.has(key)
			})
		)
	}

	return (
		<div className='bg-primary flex flex-col relative'>
			<Navbar />
			<main className='flex-1 flex flex-col items-center px-4 pt-4 pb-32'>
				<div className='w-full max-w-xs mx-auto text-center mt-2'>
					<p className='text-[1rem] text-accent font-normal mb-1 text-left'>
						Hi,{' '}
						<span className='font-bold capitalize'>
							{username ? username : '---'}
						</span>
						<span>👋</span>{' '}
						<span className='text-[1.1rem] text-accent font-medium mb-4 text-left block leading-12'>
							Welcome Back!
						</span>
					</p>

					{/* <p className='text-[0.875rem] text-accent font-normal mb-6 mt-6 text-left leading-6 w-[90%]'>
						You have{' '}
						<span className='font-bold text-[1.1rem]'>
							{outfitCount.toLocaleString()}
						</span>
						{'  '}
						looks awaiting you.
					</p> */}
					<p className='text-[0.9rem] text-accent font-semibold mb-6 mt-6 text-left flex items-center gap-2'>
						<FaHeart />
						Your Latest Favorites
					</p>
				</div>
				{/* Favorite Outfits Section */}
				{isLoading ? (
					<div className='flex justify-center items-center py-8'>
						Loading favorites...
					</div>
				) : favoriteOutfits.length === 0 ? (
					<div className='text-accent text-center py-8'>
						No favorite outfits yet.
					</div>
				) : (
					<div className='flex flex-col gap-8 w-full px-4 max-sm:px-4 mt-6'>
						<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full max-w-[1600px] mx-auto'>
							{favoriteOutfits.map((outfit, idx) => (
								<div key={idx} className='flex justify-center'>
									<OutfitCard
										outfit={outfit}
										favoriteKeys={favoriteKeys}
										onFavoriteChange={handleFavoriteChange}
									/>
								</div>
							))}
						</div>
						<div className='h-[4rem] w-full'></div>
					</div>
				)}
			</main>
		</div>
	)
}
