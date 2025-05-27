'use client'

import { useEffect } from 'react'
import CacheManager from '../lib/CacheManager'

const DataPreloader = () => {
	useEffect(() => {
		// Only preload if we're in the browser
		if (typeof window !== 'undefined') {
			CacheManager.preloadEssentialData()
		}
	}, [])

	// This component doesn't render anything
	return null
}

export default DataPreloader 