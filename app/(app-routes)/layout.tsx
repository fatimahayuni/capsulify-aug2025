import Menubar from '../components/Menubar'
import Navbar from '../components/Navbar'
import DataPreloader from '../components/DataPreloader'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div>
			<DataPreloader />
			<Navbar />
			{children}
			<Menubar />
		</div>
	)
}
