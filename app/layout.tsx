import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ThemeIconUpdater from './themeUpdater'

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
})

const fraunces = Fraunces({
	variable: '--font-fraunces',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Capsulify',
	description: 'Capsule Wardrobe',
	icons: {
		icon: '/assets/images/logo/logo.svg',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang='en' className='dark'>
				<ThemeIconUpdater />
				<body>{children}</body>
			</html>
		</ClerkProvider>
	)
}
