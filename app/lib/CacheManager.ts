import { getAllClothingVariants } from '@/app/lib/actions/clothingItems.actions'
import { getOutfits, getUserClotheItems } from '@/app/(app-routes)/outfits/actions'
import { Outfit } from '@/app/(app-routes)/outfits/types'
import { UserClothingVariantData } from './database/userdata'
import { ClothingVariantData } from './database/clothing'

class CacheManager {
	private static instance: CacheManager
	private readonly DB_NAME = 'CapsulifyCache'
	private readonly DB_VERSION = 1
	private readonly STORE_NAME = 'cacheStore'
	
	private readonly USERFIT_KEY_PREFIX = 'userFit'
	private readonly USERFIT_KEY = 'userFit_v2'
	private readonly USEROUTFITS_KEY = 'userOutfits'
	private readonly CLOTHING_VARIANTS_KEY_PREFIX = 'clothingVariants'
	private readonly CLOTHING_VARIANTS_KEY = 'clothingVariants_v2'

	private dbPromise: Promise<IDBDatabase> | null = null

	private constructor() {
		this.initializeDB()
	}

	private initializeDB(): void {
		this.dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

			request.onerror = () => {
				console.error('Error opening IndexedDB:', request.error)
				reject(request.error)
			}

			request.onsuccess = () => {
				resolve(request.result)
			}

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result
				
				// Create object store if it doesn't exist
				if (!db.objectStoreNames.contains(this.STORE_NAME)) {
					db.createObjectStore(this.STORE_NAME, { keyPath: 'key' })
				}
			}
		})
	}

	private async getDB(): Promise<IDBDatabase> {
		if (!this.dbPromise) {
			this.initializeDB()
		}
		return this.dbPromise!
	}

	private async setItem(key: string, value: any): Promise<void> {
		try {
			const db = await this.getDB()
			const transaction = db.transaction([this.STORE_NAME], 'readwrite')
			const store = transaction.objectStore(this.STORE_NAME)
			
			await new Promise<void>((resolve, reject) => {
				const request = store.put({ key, value: JSON.stringify(value) })
				request.onsuccess = () => resolve()
				request.onerror = () => reject(request.error)
			})
		} catch (error) {
			console.error(`Error storing data for key ${key}:`, error)
			throw error
		}
	}

	private async getItem(key: string): Promise<string | null> {
		try {
			const db = await this.getDB()
			const transaction = db.transaction([this.STORE_NAME], 'readonly')
			const store = transaction.objectStore(this.STORE_NAME)
			
			return new Promise<string | null>((resolve, reject) => {
				const request = store.get(key)
				request.onsuccess = () => {
					const result = request.result
					resolve(result ? result.value : null)
				}
				request.onerror = () => reject(request.error)
			})
		} catch (error) {
			console.error(`Error retrieving data for key ${key}:`, error)
			return null
		}
	}

	private async removeItem(key: string): Promise<void> {
		try {
			const db = await this.getDB()
			const transaction = db.transaction([this.STORE_NAME], 'readwrite')
			const store = transaction.objectStore(this.STORE_NAME)
			
			await new Promise<void>((resolve, reject) => {
				const request = store.delete(key)
				request.onsuccess = () => resolve()
				request.onerror = () => reject(request.error)
			})
		} catch (error) {
			console.error(`Error removing data for key ${key}:`, error)
		}
	}

	private async getAllKeys(): Promise<string[]> {
		try {
			const db = await this.getDB()
			const transaction = db.transaction([this.STORE_NAME], 'readonly')
			const store = transaction.objectStore(this.STORE_NAME)
			
			return new Promise<string[]>((resolve, reject) => {
				const request = store.getAllKeys()
				request.onsuccess = () => {
					resolve(request.result as string[])
				}
				request.onerror = () => reject(request.error)
			})
		} catch (error) {
			console.error('Error retrieving all keys:', error)
			return []
		}
	}

	async cleanupOldVersions(prefix: string, newKey: string): Promise<void> {
		try {
			const allKeys = await this.getAllKeys()
			const keysToRemove = allKeys.filter(key => 
				key.startsWith(prefix) && key !== newKey
			)
			
			for (const key of keysToRemove) {
				await this.removeItem(key)
			}
		} catch (error) {
			console.error('Error cleaning up old versions:', error)
		}
	}

	static getInstance(): CacheManager {
		if (!CacheManager.instance) {
			CacheManager.instance = new CacheManager()
		}
		return CacheManager.instance
	}

	async getUserOutfits(): Promise<Outfit[] | null> {
		// Check if outfits exist in IndexedDB first
		try {
			const storedOutfits = await this.getItem(this.USEROUTFITS_KEY)
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
			// Store the fetched data in IndexedDB
			try {
				await this.setItem(this.USEROUTFITS_KEY, data)
			} catch (error) {
				console.error(
					'Error storing outfits data in IndexedDB:',
					error
				)
			}
		}

		return data
	}

	async getUserClothingItems(): Promise<UserClothingVariantData[] | null> {
		// Check if clothing items exist in IndexedDB first
		try {
			await this.cleanupOldVersions(this.USERFIT_KEY_PREFIX, this.USERFIT_KEY)

			const storedItems = await this.getItem(this.USERFIT_KEY)
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
			// Store the fetched data in IndexedDB
			try {
				await this.setItem(this.USERFIT_KEY, items)
			} catch (error) {
				console.error(
					'Error storing clothing items data in IndexedDB:',
					error
				)
			}
		}

		return items
	}

	async getClothingVariants(): Promise<ClothingVariantData[]> {
		// Check if clothing variants exist in IndexedDB first
		try {
			await this.cleanupOldVersions(this.CLOTHING_VARIANTS_KEY_PREFIX, this.CLOTHING_VARIANTS_KEY)

			const storedVariants = await this.getItem(this.CLOTHING_VARIANTS_KEY)
			if (storedVariants) {
				return JSON.parse(storedVariants)
			}
		} catch (error) {
			console.error('Error parsing cached clothing variants data:', error)
			// Continue to fetch from server if cache is corrupted
		}

		// If no cached data or cache is corrupted, fetch from server
		const variants = await getAllClothingVariants()
		
		// Store the grouped data in IndexedDB
		try {
			await this.setItem(this.CLOTHING_VARIANTS_KEY, variants)
		} catch (error) {
			console.error(
				'Error storing clothing variants data in IndexedDB:',
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
	async clearUserFitCache(): Promise<void> {
		try {
			await this.removeItem(this.USERFIT_KEY)
		} catch (error) {
			console.error('Error clearing fit cache:', error)
		}
	}

	// Clears the outfits cache
    // This should be called if the users fit or capsule items are modified.
	async clearUserOutfitsCache(): Promise<void> {
		try {
			await this.removeItem(this.USEROUTFITS_KEY)
		} catch (error) {
			console.error('Error clearing outfits cache:', error)
		}
	}

	// Clears the clothing variants cache
	async clearClothingVariantsCache(): Promise<void> {
		try {
			await this.removeItem(this.CLOTHING_VARIANTS_KEY)
		} catch (error) {
			console.error('Error clearing clothing variants cache:', error)
		}
	}

	// Clears all cached data.
	async invalidateCache(): Promise<void> {
		await Promise.all([
			this.clearUserFitCache(),
			this.clearUserOutfitsCache(),
			this.clearClothingVariantsCache()
		])
	}
}

export default CacheManager.getInstance() 