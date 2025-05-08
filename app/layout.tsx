import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs'
import Navbar from './components/Navbar'

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Capsulify',
	description: 'Capsule Wardrobe',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body>
					<Navbar />
					{children}
				</body>
			</html>
		</ClerkProvider>
	)
}
