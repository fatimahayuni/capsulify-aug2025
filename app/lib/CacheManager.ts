import { getUserWardrobe, getAllClothingVariants } from '@/app/lib/actions/clothingItems.actions'
import { getOutfits, getClothingItems } from '@/app/(app-routes)/outfits/actions'
import { Outfit } from '@/app/(app-routes)/outfits/types'

// Type for fit items from getUserFitItems
interface FitItem {
	id: number
	category_id: number
	subcategory_id: number
	colour_type_id: number
	name: string
	top_sleeve_type_id: number | null
	blouse_sleeve_type_id: number | null
	neckline_id: number | null
	dress_cut_id: number | null
	bottom_cut_id: number | null
	short_cut_id: number | null
	skirt_cut_id: number | null
	image_file_name: string
	clothing_variant_id: number
}

// Type for segregated fit (grouped by category)
type SegregatedFit = Record<number, FitItem[]>

// Type for clothing items from getClothingItems
interface ClothingItemData {
	clothing_variant_id: number
	category_id: number
	subcategory_id: number
	image_file_name: string
	name: string
}

// Type for clothing variants
interface ClothingVariant {
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
	subcategory_id: number
	colour_type_id: number
}

// Type for grouped clothing variants (by subcategory and color)
type GroupedClothingVariants = Record<string, ClothingVariant[]>

class CacheManager {
	private static instance: CacheManager
	private readonly FIT_KEY = 'fit'
	private readonly OUTFITS_KEY = 'outfits'
	private readonly CLOTHING_ITEMS_KEY = 'clothingItems'
	private readonly CLOTHING_VARIANTS_KEY = 'clothingVariants'

	private constructor() {}

	static getInstance(): CacheManager {
		if (!CacheManager.instance) {
			CacheManager.instance = new CacheManager()
		}
		return CacheManager.instance
	}

	async getUserFitItems(clerkId: string): Promise<SegregatedFit> {
		if (!clerkId) return {}

		// Check if data exists in local storage first
		try {
			const cachedFit = localStorage.getItem(this.FIT_KEY)
			if (cachedFit) {
				const parsedFit = JSON.parse(cachedFit)
				return parsedFit
			}
		} catch (error) {
			console.error('Error parsing cached fit data:', error)
			// Continue to fetch from server if cache is corrupted
		}

		// If no cached data or cache is corrupted, fetch from server
		const currentUsersFit = await getUserWardrobe(clerkId)

		// Store the fetched data in local storage
		try {
			localStorage.setItem(
				this.FIT_KEY,
				JSON.stringify(currentUsersFit)
			)
		} catch (error) {
			console.error(
				'Error storing fit data in localStorage:',
				error
			)
		}

		return currentUsersFit
	}

	async getUserOutfits(): Promise<Outfit[] | null> {
		// Check if outfits exist in localStorage first
		try {
			const storedOutfits = localStorage.getItem(this.OUTFITS_KEY)
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
				localStorage.setItem(this.OUTFITS_KEY, JSON.stringify(data))
			} catch (error) {
				console.error(
					'Error storing outfits data in localStorage:',
					error
				)
			}
		}

		return data
	}

	async getClothingItems(): Promise<ClothingItemData[] | null> {
		// Check if clothing items exist in localStorage first
		try {
			const storedItems = localStorage.getItem(this.CLOTHING_ITEMS_KEY)
			if (storedItems) {
				return JSON.parse(storedItems)
			}
		} catch (error) {
			console.error('Error parsing cached clothing items data:', error)
			// Continue to fetch from server if cache is corrupted
		}

		// If no cached data or cache is corrupted, fetch from server
		const items = await getClothingItems()
		if (items) {
			// Store the fetched data in local storage
			try {
				localStorage.setItem(this.CLOTHING_ITEMS_KEY, JSON.stringify(items))
			} catch (error) {
				console.error(
					'Error storing clothing items data in localStorage:',
					error
				)
			}
		}

		return items
	}

	async getClothingVariants(): Promise<GroupedClothingVariants> {
		// Check if clothing variants exist in localStorage first
		try {
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
		
		// Group variants by subcategory_id and colour_type_id
		const groupedVariants: GroupedClothingVariants = {}
		variants.forEach((variant: ClothingVariant) => {
			const key = `${variant.subcategory_id}_${variant.colour_type_id}`
			if (!groupedVariants[key]) {
				groupedVariants[key] = []
			}
			groupedVariants[key].push(variant)
		})

		// Store the grouped data in local storage
		try {
			localStorage.setItem(this.CLOTHING_VARIANTS_KEY, JSON.stringify(groupedVariants))
		} catch (error) {
			console.error(
				'Error storing clothing variants data in localStorage:',
				error
			)
		}

		return groupedVariants
	}

	// Get variants for a specific subcategory and color
	async getVariantsForSubcategoryAndColor(subcategory_id: number, colour_type_id: number): Promise<ClothingVariant[]> {
		const allVariants = await this.getClothingVariants()
		const key = `${subcategory_id}_${colour_type_id}`
		return allVariants[key] || []
	}

	// Preload all essential data for the app.
	async preloadEssentialData(): Promise<void> {
		try {		
			await this.getClothingVariants()
			await this.getClothingItems()
		} catch (error) {
			console.error('Error preloading essential data:', error)
		}
	}

	// Clears the fit cache.
    // This should be called if the users fit is modified in any way.
	clearFitCache(): void {
		try {
			localStorage.removeItem(this.FIT_KEY)
		} catch (error) {
			console.error('Error clearing fit cache:', error)
		}
	}

	// Clears the outfits cache
    // This should be called if the users fit or capsule items are modified.
	clearOutfitsCache(): void {
		try {
			localStorage.removeItem(this.OUTFITS_KEY)
		} catch (error) {
			console.error('Error clearing outfits cache:', error)
		}
	}

    // Clears the clothing items cache. This should be called if clothing items are modified in the database.
	clearClothingItemsCache(): void {
		try {
			localStorage.removeItem(this.CLOTHING_ITEMS_KEY)
		} catch (error) {
			console.error('Error clearing clothing items cache:', error)
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
		this.clearFitCache()
		this.clearOutfitsCache()
		this.clearClothingItemsCache()
		this.clearClothingVariantsCache()
	}
}

export default CacheManager.getInstance() 