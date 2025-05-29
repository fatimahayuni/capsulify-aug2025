'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import CacheManager from '../lib/CacheManager'

const DataPreloader = () => {
	const { isSignedIn } = useAuth()

	useEffect(() => {
		// Only preload if we're in the browser and user is logged in.
		if (typeof window !== 'undefined' && isSignedIn) {
			CacheManager.preloadEssentialData()
		}
	}, [isSignedIn])

	// This component doesn't render anything
	return null
}

export default DataPreloader 