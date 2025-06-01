import React, { useEffect, useState } from 'react'
import { getInfoText } from '../../lib/data/client/infotext'

type InfoModalProps = {
	setIsInfoOpen: (isOpen: boolean) => void
	infoTextId: string
}

function InfoModal({ setIsInfoOpen, infoTextId }: InfoModalProps) {
	const [infoText, setInfoText] = useState<string>('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadInfoText = async () => {
			try {
				setIsLoading(true)
				const text = await getInfoText(infoTextId)
				setInfoText(text)
			} catch (error) {
				console.error('Error loading info text:', error)
				setInfoText('Failed to load information.')
			} finally {
				setIsLoading(false)
			}
		}

		loadInfoText()
	}, [infoTextId])

	return (
		<div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 w-full h-full'>
			<div className='bg-primary w-full max-w-2xl max-h-[80vh] rounded-lg shadow-lg relative overflow-y-auto'>
				<button
					onClick={() => setIsInfoOpen(false)}
					className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-amber-950 rounded-full hover:scale-120 transition-transform duration-200 cursor-pointer'
				>
					✕
				</button>

				<div className='p-8 pt-16'>
					{isLoading ? (
						<div className='flex items-center justify-center h-32'>
							<div className='text-accent text-sm'>Loading information...</div>
						</div>
					) : (
						<div className='text-accent leading-relaxed'>
							{infoText}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default InfoModal 