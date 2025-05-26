import { FaEdit } from 'react-icons/fa'

const page = () => {
	return (
		<div className='min-h-screen bg-primary flex flex-col items-center py-4 px-2 mb-20 leading-8 text-accent'>
			{/* Profile Image */}
			<div className='flex flex-col items-center mt-2 mb-2'>
				<div className='w-20 h-20 rounded-full border-4 border-accent flex items-center justify-center bg-secondary'>
					<svg
						className='w-12 h-12 text-accent'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z'
						/>
					</svg>
				</div>
				<div className='text-xl font-semibold mt-2'>Lisa</div>
				<div className='text-xs'>Subscribed since • Jul, 2025</div>
			</div>
			{/* Personal Info */}
			<div className='w-full max-w-xs'>
				<div>
					<div className='flex items-center justify-between mt-4 mb-3'>
						<span className='font-semibold text-sm'>
							Personal Info
						</span>
						<FaEdit className='text-xs cursor-pointer' />
					</div>
					<div className='bg-secondary rounded-lg p-3 text-xs mb-2'>
						<div className='flex justify-between mb-2.5'>
							<span className='font-semibold'>Name</span>
							<span>Lisa</span>
						</div>
						<div className='flex justify-between mb-2.5'>
							<span className='font-semibold'>Age</span>
							<span>27 yrs</span>
						</div>
						<div className='flex justify-between mb-2.5'>
							<span className='font-semibold'>Email</span>
							<span>capsulifyapp@gmail.com</span>
						</div>
						<div className='flex justify-between mb-1'>
							<span className='font-semibold'>Location</span>
							<span>Singapore</span>
						</div>
					</div>
				</div>

				{/* Your Goal */}
				<div className='bg-secondary rounded-lg p-3 text-xs mb-6'>
					<div className='font-semibold mb-3 mt-2'>
						YOUR GOAL WITH CAPSULIFY WARDROBE
					</div>
					<div className='font-medium mb-2'>
						Build a versatile professional wardrobe. I want to feel
						confident and free.
					</div>
				</div>

				{/* Basic Info */}
				<div>
					<div className='flex items-center justify-between mt-4 mb-1'>
						<span className='font-semibold text-sm mb-2.5'>
							Basic Info
						</span>
						<FaEdit className='text-xs cursor-pointer' />
					</div>
					<div className='bg-secondary rounded-lg p-3 text-xs mb-6'>
						<div className='flex justify-between mb-2.5'>
							<span className='font-semibold'>Body Shape</span>
							<span>Inverted Triangle</span>
						</div>
						<div className='flex justify-between mb-2.5'>
							<span className='font-semibold'>Height</span>
							<span>5 ft 7 inches</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-semibold'>
								Personal Style
							</span>
							<span>Classic</span>
						</div>
					</div>
				</div>

				{/* Preferences */}
				<div>
					<div className='flex items-center justify-between mt-4 mb-3'>
						<span className='font-semibold text-sm'>
							Preferences
						</span>
						<FaEdit className='text-xs cursor-pointer' />
					</div>
					<div className='bg-secondary rounded-lg p-3 text-xs mb-2'>
						<div className='mb-4'>
							<div className='font-semibold text-[11px] mb-2'>
								BODY FEATURES TO ACCENTUATE
							</div>
							<div className='text-[11px]'>
								<span>Neck Collarbone</span> |{' '}
								<span>Waist</span>
							</div>
						</div>
						<div className='mb-4'>
							<div className='font-semibold text-[11px] mb-2'>
								BODY FEATURES TO CONCEAL
							</div>
							<div className='text-[11px]'>
								<span>Shoulders</span> | <span>Knees</span> |{' '}
								<span>Butt/Rear</span>
							</div>
						</div>
						<div className='flex flex-wrap gap-x-8 gap-y-2'>
							<div>
								<div className='font-semibold text-[11px] mb-2 mt-3'>
									NECKLINES
								</div>
								<div className='text-[11px]'>
									V-Neck | Scoop
								</div>
							</div>
							<div>
								<div className='font-semibold text-[11px] mb-2 mt-3'>
									SLEEVE STYLES
								</div>
								<div className='text-[11px]'>
									3/4 length | Long
								</div>
							</div>
							<div>
								<div className='font-semibold text-[11px] mb-2 mt-3'>
									BOTTOM CUTS
								</div>
								<div className='text-[11px]'>
									A-Line | Straight
								</div>
							</div>
							<div>
								<div className='font-semibold text-[11px] mb-2 mt-3'>
									SKIRT LENGTHS
								</div>
								<div className='text-[11px]'>
									Knee length | Midi
								</div>
							</div>
							<div>
								<div className='font-semibold text-[11px] mb-2 mt-3'>
									SHOE PREFERENCES
								</div>
								<div className='text-[11px] flex flex-row gap-5'>
									<div className='flex flex-col gap-2'>
										<p>Heels</p>
										<div>
											<span>2-3 Inches</span> |{' '}
											<span>Block Heels</span>
										</div>
									</div>
									<div className='flex flex-col gap-2'>
										<p>Toe-Box</p>
										<div>
											<span>Almond</span> |{' '}
											<span>Round</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Typical Events */}
				<div className='bg-secondary rounded-lg p-3 text-xs mt-4'>
					<div className='font-semibold mb-4'>
						TYPICAL EVENTS THIS MONTH
					</div>
					<div className='flex flex-col gap-2'>
						<div className='flex items-center justify-between mb-2'>
							<span>Work From Office</span>
							<span className='bg-[#cbb89d] text-white rounded px-2 py-0.5 text-xs'>
								8
							</span>
						</div>
						<div className='flex items-center justify-between mb-2'>
							<span>Dates</span>
							<span className='bg-[#cbb89d] text-white rounded px-2 py-0.5 text-xs'>
								2
							</span>
						</div>
						<div className='flex items-center justify-between mb-2'>
							<span>Travels</span>
							<span className='bg-[#cbb89d] text-white rounded px-2 py-0.5 text-xs'>
								5
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default page
