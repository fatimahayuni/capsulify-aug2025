import React from 'react'
import Image from 'next/image'

const PrivacyPolicy = () => {
	const currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return (
		<div className='text-accent'>
			<header className='w-full flex items-center justify-between px-2 md:px-6 py-4 bg-[#ad4c5c] text-primary font-fraunces'>
				<div className='flex items-center gap-1 cursor-pointer hover:bg-accent/20 rounded-lg px-1 md:px-2 py-1 transition-colors flex-1 justify-start'>
					<Image
						src='/assets/images/logo/logo-light.svg'
						alt='Capsulify Logo'
						width={40}
						height={40}
						className='w-6 h-6 md:w-8 md:h-8'
					/>
					<span className='font-semibold text-[0.875rem] md:text-lg tracking-tight'>
						CAPSULIFY
					</span>
				</div>
				<nav className='flex-1 flex justify-end'>
					<a
						href='https://buy.stripe.com/eVq4gA0F70331UqgGafMA02'
						target='_blank'
						rel='noopener noreferrer'
						className='font-fraunces max-sm:text-[0.625rem] text-[0.75rem] cursor-pointer text-primary font-semibold mx-2 max-sm:py-1 transition-all duration-300 hover:shadow-md hover:scale-[1.08] active:scale-[0.98] uppercase border-b-4 border-[#f8c255] tracking-wider py-1'
					>
						<em>Get instant access</em>
					</a>
				</nav>
			</header>

			<div className='space-y-6 max-w-4xl mx-auto px-4 py-10'>
				<h1 className='text-3xl font-bold mb-6'>Privacy Policy</h1>
				<p className='text-sm text-gray-600 mb-6'>
					Last updated: {currentDate}
				</p>
				<p className='text-base'>
					Capsulify ("we", "our", or "us") is committed to protecting
					your privacy. This Privacy Policy explains how we collect,
					use, and safeguard your information when you use our website
					or app.
				</p>

				<section>
					<h2 className='text-xl font-semibold mb-3'>
						1. Information We Collect
					</h2>
					<ul className='list-disc pl-6 space-y-1.5 text-sm'>
						<li>
							<strong>Personal Data:</strong> Name, email address,
							body shape preferences, and style data you provide.
						</li>
						<li>
							<strong>Usage Data:</strong> Pages visited, features
							used, and device type.
						</li>
						<li>
							<strong>Payment Info:</strong> Processed securely by
							third-party providers (e.g., Stripe). We do not
							store any card details.
						</li>
					</ul>
				</section>

				<section>
					<h2 className='text-xl font-semibold mb-3'>
						2. How We Use Your Information
					</h2>
					<ul className='list-disc pl-6 space-y-1.5 text-sm'>
						<li>
							To personalize your experience and generate outfit
							recommendations
						</li>
						<li>To improve our services and product features</li>
						<li>To process payments and deliver content</li>
						<li>
							To communicate with you via email (you can opt out
							anytime)
						</li>
					</ul>
				</section>

				<section>
					<h2 className='text-xl font-semibold mb-3'>
						3. Sharing Your Information
					</h2>
					<p className='text-sm'>
						We do not sell or rent your data. We only share data
						with trusted third-party tools for the purposes listed
						above (e.g., analytics, email providers, payment
						processors).
					</p>
				</section>

				<section>
					<h2 className='text-xl font-semibold mb-3'>
						4. Data Storage & Security
					</h2>
					<p className='text-sm'>
						Your data is stored securely using reputable cloud
						platforms. We take all reasonable precautions to protect
						your information.
					</p>
				</section>

				<section>
					<h2 className='text-xl font-semibold mb-3'>
						5. Your Rights
					</h2>
					<p className='text-sm'>
						You may request to access, correct, or delete your
						personal data. Email us at{' '}
						<a
							href='mailto:hello@capsulify.app'
							className='hover:underline font-semibold'
						>
							hello@capsulify.app
						</a>{' '}
						for any requests.
					</p>
				</section>

				<section>
					<h2 className='text-xl font-semibold mb-3'>6. Cookies</h2>
					<p className='text-sm'>
						We use cookies to analyze traffic and enhance user
						experience. You can manage cookies through your browser
						settings.
					</p>
				</section>

				<section>
					<h2 className='text-xl font-semibold mb-3'>
						7. Contact Us
					</h2>
					<p className='text-sm'>
						For any privacy concerns or questions, please contact us
						at:{' '}
						<a
							href='mailto:hello@capsulify.app'
							className='hover:underline font-semibold'
						>
							hello@capsulify.app
						</a>
					</p>
				</section>
			</div>
			<footer className='w-full bg-[#efe9e4] py-6 mt-0'>
				<div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4'>
					<div className='flex flex-col items-center md:items-start mb-2 md:mb-0'>
						<span
							className='text-2xl mb-1'
							role='img'
							aria-label='email'
						>
							📧
						</span>
						<span className='text-accent font-inter text-xs'>
							capsulifyapp@gmail.com
						</span>
					</div>
					<div className='flex flex-col items-center mb-2 md:mb-0 gap-1'>
						<span className='text-accent font-inter text-xs italic'>
							© 2025 Capsulify. All rights reserved.
						</span>
						<a
							href='/privacy-policy'
							className='text-accent font-inter text-xs hover:underline font-semibold mt-2'
						>
							Privacy Policy
						</a>
					</div>
					<div className='flex flex-col items-center md:items-end'>
						<span
							className='text-2xl mb-1'
							role='img'
							aria-label='location'
						>
							📍
						</span>
						<span className='text-accent font-inter text-xs'>
							Bedok, Singapore
						</span>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default PrivacyPolicy
