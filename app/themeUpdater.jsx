'use client'

import { useEffect } from 'react'

export default function ThemeIconUpdater() {
	useEffect(() => {
		const updateFavicon = (isDark) => {
			const favicon =
				document.querySelector("link[rel~='icon']") ||
				document.createElement('link')
			favicon.setAttribute('rel', 'icon')
			favicon.setAttribute('type', 'image/svg+xml')
			favicon.setAttribute(
				'href',
				isDark
					? '/assets/images/logo/logo-light.svg'
					: '/assets/images/logo/logo.svg'
			)
			document.head.appendChild(favicon)
		}

		// Initial favicon set
		const media = window.matchMedia('(prefers-color-scheme: dark)')
		updateFavicon(media.matches)
		// Watch for theme changes
		const listener = (e) => updateFavicon(e.matches)
		media.addEventListener('change', listener)

		return () => {
			media.removeEventListener('change', listener)
		}
	}, [])

	return null
}
