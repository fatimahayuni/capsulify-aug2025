import { getAllClothingVariants } from '@/app/lib/actions/clothingItems.actions'
import { getOutfits, getUserClotheItems } from '@/app/(app-routes)/outfits/actions'
import { Outfit } from '@/app/(app-routes)/outfits/types'
import { UserClothingVariantData } from './database/userdata'
import { ClothingVariantData } from './database/clothing'

class CacheManager {
	private static instance: CacheManager
	private readonly USERFIT_KEY = 'userFit'
	private readonly USEROUTFITS_KEY = 'userOutfits'

	private readonly CLOTHING_VARIANTS_KEY_PREFIX = 'clothingVariants'
	private readonly CLOTHING_VARIANTS_KEY = 'clothingVariants_v2'

	private constructor() {}

	async cleanupOldVersions(prefix: string, newKey: string): Promise<void> {
		const keysToRemove: string[] = []
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)
			if (key?.startsWith(prefix) && key !== newKey) {
				keysToRemove.push(key)
			}
		}
		keysToRemove.forEach(key => localStorage.removeItem(key))
	}

	static getInstance(): CacheManager {
		if (!CacheManager.instance) {
			CacheManager.instance = new CacheManager()
		}
		return CacheManager.instance
	}

	async getUserOutfits(): Promise<Outfit[] | null> {
		// Check if outfits exist in localStorage first
		try {
			const storedOutfits = localStorage.getItem(this.USEROUTFITS_KEY)
			if (storedOutfits) {
				const outfitsData = JSON.parse(storedOutfits)
				return outfitsData
			}
		} catch (error) {
			console.error('Error parsing cached outfits data:', error)
			// Continue to fetch from server if cache is corrupted
		}

		// If no cached data or cache is corrupted, fetch from server
		const data = await getOutfits()
		if (data) {
			// Store the fetched data in local storage
			try {
				localStorage.setItem(this.USEROUTFITS_KEY, JSON.stringify(data))
			} catch (error) {
				console.error(
					'Error storing outfits data in localStorage:',
					error
				)
			}
		}

		return data
	}

	async getUserClothingItems(): Promise<UserClothingVariantData[] | null> {
		// Check if clothing items exist in localStorage first
		try {
			const storedItems = localStorage.getItem(this.USERFIT_KEY)
			if (storedItems) {
				return JSON.parse(storedItems)
			}
		} catch (error) {
			console.error('Error parsing cached clothing items data:', error)
			// Continue to fetch from server if cache is corrupted
		}

		// If no cached data or cache is corrupted, fetch from server
		const items = await getUserClotheItems()
		
		if (items) {
			// Store the fetched data in local storage
			try {
				localStorage.setItem(this.USERFIT_KEY, JSON.stringify(items))
			} catch (error) {
				console.error(
					'Error storing clothing items data in localStorage:',
					error
				)
			}
		}

		return items
	}

	async getClothingVariants(): Promise<ClothingVariantData[]> {
		// Check if clothing variants exist in localStorage first
		try {
			await this.cleanupOldVersions(this.CLOTHING_VARIANTS_KEY_PREFIX, this.CLOTHING_VARIANTS_KEY)
			
			const storedVariants = localStorage.getItem(this.CLOTHING_VARIANTS_KEY)
			if (storedVariants) {
				return JSON.parse(storedVariants)
			}
		} catch (error) {
			console.error('Error parsing cached clothing variants data:', error)
			// Continue to fetch from server if cache is corrupted
		}

		// If no cached data or cache is corrupted, fetch from server
		const variants = await getAllClothingVariants()
		
		// Store the grouped data in local storage
		try {
			localStorage.setItem(this.CLOTHING_VARIANTS_KEY, JSON.stringify(variants))
		} catch (error) {
			console.error(
				'Error storing clothing variants data in localStorage:',
				error
			)
		}

		return variants;
	}

	// Preload all essential data for the app.
	async preloadEssentialData(): Promise<void> {
		try {		
			await this.getClothingVariants()
			await this.getUserClothingItems()
		} catch (error) {
			console.error('Error preloading essential data:', error)
		}
	}

	// Clears the fit cache.
    // This should be called if the users fit is modified in any way.
	clearUserFitCache(): void {
		try {
			localStorage.removeItem(this.USERFIT_KEY)
		} catch (error) {
			console.error('Error clearing fit cache:', error)
		}
	}

	// Clears the outfits cache
    // This should be called if the users fit or capsule items are modified.
	clearUserOutfitsCache(): void {
		try {
			localStorage.removeItem(this.USEROUTFITS_KEY)
		} catch (error) {
			console.error('Error clearing outfits cache:', error)
		}
	}

	// Clears the clothing variants cache
	clearClothingVariantsCache(): void {
		try {
			localStorage.removeItem(this.CLOTHING_VARIANTS_KEY)
		} catch (error) {
			console.error('Error clearing clothing variants cache:', error)
		}
	}

	// Clears all cached data.
	invalidateCache(): void {
		this.clearUserFitCache()
		this.clearUserOutfitsCache()
		this.clearClothingVariantsCache()
	}
}

export default CacheManager.getInstance() 