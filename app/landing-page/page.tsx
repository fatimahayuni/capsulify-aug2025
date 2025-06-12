'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

// Types for FAQ
interface FAQ {
	q: string
	a: React.ReactNode
}

interface FAQColumnProps {
	faqs: FAQ[]
	columnKey: string
}

interface FAQItemProps {
	question: string
	answer: React.ReactNode
	open: boolean
	onClick: () => void
}

// FAQColumn and FAQItem components
function FAQColumn({ faqs, columnKey }: FAQColumnProps) {
	const [openIdx, setOpenIdx] = React.useState<number | null>(null)
	return (
		<div className='space-y-4'>
			{faqs.map((faq, idx) => (
				<FAQItem
					key={faq.q}
					question={faq.q}
					answer={faq.a}
					open={openIdx === idx}
					onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
				/>
			))}
		</div>
	)
}

function FAQItem({ question, answer, open, onClick }: FAQItemProps) {
	return (
		<div className='pb-2'>
			<button
				className='flex items-center w-full text-left text-accent font-inter text-[1rem] font-medium focus:outline-none py-2'
				onClick={onClick}
				aria-expanded={open}
				type='button'
			>
				<span className='flex-1 font-bold'>{question}</span>
				<span className='ml-2'>
					{/* Reverse the arrow logic: down arrow when closed, up arrow when open */}
					{!open ? (
						<svg
							className='w-5 h-5 cursor-pointer'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19 9l-7 7-7-7'
							/>
						</svg>
					) : (
						<svg
							className='w-5 h-5 cursor-pointer'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19 15l-7-7-7 7'
							/>
						</svg>
					)}
				</span>
			</button>
			{open && (
				<div className='pl-2 pr-2 pb-2 text-accent/90 text-[0.95rem] animate-fade-in leading-6'>
					{answer}
				</div>
			)}
		</div>
	)
}

// Countdown Timer Component
function CountdownTimer() {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	})

	useEffect(() => {
		// Target: June 30, 2025, 11:59:00 PM SGT (UTC+8)
		function getSGTTargetDate() {
			// 11:59 PM SGT on June 30, 2025 is 15:59 UTC on June 30, 2025
			const utcDate = new Date(Date.UTC(2025, 5, 30, 15, 59, 0))
			return utcDate
		}

		const targetDate = getSGTTargetDate()

		const updateTimer = () => {
			const now = new Date()
			const difference = targetDate.getTime() - now.getTime()

			if (difference > 0) {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24))
				const hours = Math.floor(
					(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				)
				const minutes = Math.floor(
					(difference % (1000 * 60 * 60)) / (1000 * 60)
				)
				const seconds = Math.floor((difference % (1000 * 60)) / 1000)
				setTimeLeft({ days, hours, minutes, seconds })
			} else {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
			}
		}

		updateTimer()
		const timer = setInterval(updateTimer, 1000)
		return () => clearInterval(timer)
	}, [])

	const boxClass =
		'bg-primary text-accent rounded-lg w-14 h-14 md:w-18 md:h-18 flex flex-col items-center justify-center mx-1 shadow-md'
	const numberClass =
		'font-mono text-[1.25rem] text-accent md:text-2xl font-extrabold leading-none tracking-wider'
	const labelClass =
		'text-[0.45rem] md:text-[0.65rem] font-medium mt-1 tracking-wide text-accent uppercase tracking-wider'

	return (
		<div className='flex justify-center items-center gap-0 mt-2'>
			<div className={boxClass}>
				<span className={numberClass}>
					{String(timeLeft.days).padStart(2, '0')}
				</span>
				<span className={labelClass}>Days</span>
			</div>
			<div className={boxClass}>
				<span className={numberClass}>
					{String(timeLeft.hours).padStart(2, '0')}
				</span>
				<span className={labelClass}>Hours</span>
			</div>
			<div className={boxClass}>
				<span className={numberClass}>
					{String(timeLeft.minutes).padStart(2, '0')}
				</span>
				<span className={labelClass}>Minutes</span>
			</div>
			<div className={boxClass}>
				<span className={numberClass}>
					{String(timeLeft.seconds).padStart(2, '0')}
				</span>
				<span className={labelClass}>Seconds</span>
			</div>
		</div>
	)
}

// aditisd30@gmail.com
// eBook Section logic
function EbookSection() {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess(false)
		try {
			const res = await fetch('/api/subscriber', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			})
			const data = await res.json()
			if (!res.ok) {
				throw new Error(data.error || 'Failed to subscribe')
			}
			setSuccess(true)
			// Trigger eBook download
			const link = document.createElement('a')
			link.href = '/assets/ebook/capsulify-ebook.pdf'
			link.download = 'capsulify-ebook.pdf'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (err: any) {
			setError(err.message || 'Something went wrong.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='w-[90%] max-w-6xl mx-auto px-2 pb-8 rounded-md max-sm:w-[90%] mt-10'>
			<h2 className='text-center text-[1.6rem] md:text-4xl text-accent font-extrabold font-fraunces pb-8 pt-10'>
				Get instant access to the full eBook
			</h2>
			<div className='flex justify-center my-6'>
				<Image
					src='/assets/images/ebookcover.jpeg'
					alt='eBook Cover'
					width={320}
					height={420}
					className='w-80 h-auto rounded-sm shadow-lg bg-white object-contain max-w-full'
				/>
			</div>
			<p className='text-center text-accent/80 mb-6 text-[1rem] md:text-lg font-inter'>
				Enter your email to get a free sample
			</p>
			<form
				onSubmit={handleSubmit}
				className='w-[60%] mx-auto flex flex-col sm:flex-row gap-3 items-center justify-center'
			>
				<input
					type='email'
					required
					placeholder='Enter your e-mail address'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='flex-1 px-4 py-3 rounded-l-md border border-accent/30 focus:outline-none text-accent bg-[#efe9e4] text-[1rem] min-w-[300px] max-sm:rounded-r-md'
				/>
				<button
					type='submit'
					disabled={loading}
					className=' bg-[#f8c255] text-accent font-bold px-6 py-3 rounded-r-md rounded-l-none transition-all duration-200 hover:bg-[#f0d297] shadow-md text-[1rem] capitalize font-fraunces italic cursor-pointer max-sm:rounded-l-md disabled:opacity-60'
				>
					{loading ? 'Processing...' : 'Download eBook Now'}
				</button>
			</form>
			{error && <p className='text-red-600 text-center mt-2'>{error}</p>}
			{success && (
				<p className='text-green-600 text-center mt-2'>
					Success! Your download should begin shortly.
				</p>
			)}
		</div>
	)
}

const page = () => {
	return (
		<div className='min-h-screen bg-primary text-accent font-inter flex flex-col'>
			{/* Header */}
			<header className='w-full flex items-center justify-between px-2 md:px-6 py-4 bg-[#ad4c5c] text-primary font-fraunces'>
				<div className='flex items-center gap-1 cursor-pointer hover:bg-accent/20 rounded-lg px-1 md:px-2 py-1 transition-colors flex-1 justify-start'>
					<Image
						src='/assets/images/logo/logo-light.svg'
						alt='Capsulify Logo'
						width={40}
						height={40}
						className='w-6 h-6 md:w-8 md:h-8'
					/>
					<span className='font-semibold text-[1rem] md:text-xl tracking-tight'>
						CAPSULIFY
					</span>
				</div>
				<nav className='flex-1 flex justify-end'>
					<a
						href='https://buy.stripe.com/eVq4gA0F70331UqgGafMA02'
						target='_blank'
						rel='noopener noreferrer'
						className='font-fraunces max-sm:text-[0.75rem] text-[0.875rem] cursor-pointer text-primary font-semibold mx-2 max-sm:py-1 transition-all duration-300 hover:shadow-md hover:scale-[1.08] active:scale-[0.98] uppercase border-b-4 border-[#f8c255] tracking-wider py-1'
					>
						<em>Get instant access</em>
					</a>
				</nav>
			</header>

			{/* Main Content */}
			<main className='flex-1 flex flex-col items-center px-0'>
				{/* Hero Section */}
				<section className='w-full mx-auto bg-[#ad4c5c] text-primary py-10 md:py-20 px-6 md:px-30'>
					<div className='flex flex-col md:flex-row items-center justify-center gap-8'>
						<div className='flex-1 max-w-5xl'>
							<h1 className='text-[2rem] md:text-5xl font-extrabold mb-4 tracking-tight leading-12 font-fraunces'>
								Tired of Dressing for a Body Shape Fashion
								Forgot?
							</h1>
							<a
								href='https://buy.stripe.com/eVq4gA0F70331UqgGafMA02'
								target='_blank'
								rel='noopener noreferrer'
								className='bg-[#f8c255] mx-auto my-6 text-accent cursor-pointer font-extrabold tracking-wide px-8 py-3 rounded-xl mb-8 transition-all duration-300 transform-all hover:scale-105 hover:shadow-lg text-[0.875rem] uppercase '
							>
								<em>Get instant access</em>
							</a>
						</div>
					</div>
				</section>
				{/* Top Section */}
				<div className='w-full pt-8'>
					<section className='w-full max-w-6xl mx-auto px-2 pb-8 rounded-md max-sm:w-[90%]'>
						{/* <h2 className='text-center text-[1.6rem] md:text-4xl text-accent font-extrabold font-fraunces pb-8 pt-10'>
							Tired of Dressing for a Body Shape that Fashion
							Forgot?
						</h2> */}
						<p className='text-md md:text-lg mb-8 text-accent/80'>
							If you've ever looked in the mirror and thought:
						</p>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
							{/* Boxy */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.25rem]'>
									<span className=''>
										<em>"Everything looks boxy on me."</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									Tops and jackets often feel like they hang
									straight from the shoulders, creating a
									blocky silhouette with no waist definition.
								</p>
							</div>
							{/* Sleeveless */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.25rem]'>
									<span className=''>
										<em>
											"I hate how sleeveless tops make me
											look."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									Strapless, halters, and thin-strapped tops
									can exaggerate broad shoulders, making you
									feel masculine or top-heavy even when the
									style is feminine.
								</p>
							</div>
							{/* Jeans */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.25rem]'>
									<span className=''>
										<em>
											"My jeans never balance me out."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									No matter how much you love skinny jeans,
									they often emphasize the narrowness of your
									hips — making your upper body look even
									wider in contrast.
								</p>
							</div>
							{/* Dresses */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.25rem]'>
									<span className=''>
										<em>"Dresses just don't fit right."</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									Dresses often either cling weirdly at the
									top or float shapelessly, leaving you
									feeling unstructured or overwhelmed by
									fabric.
								</p>
							</div>
							{/* Blazers */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.25rem]'>
									<span className=''>
										<em>
											"Blazers make me look like a
											bouncer."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									Structured outerwear, especially with
									shoulder pads, can push your proportions
									even further out of balance.
								</p>
							</div>
							{/* Feminine */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.25rem]'>
									<span className=''>
										<em>
											"I feel like I can never look soft
											or feminine."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									Fashion often tells you to "embrace your
									strong frame," but it rarely teaches you how
									to create softness, movement, or curve in
									your outfits — so you give up and default to
									basics.
								</p>
							</div>
						</div>
					</section>
				</div>

				{/* You're not alone Section */}
				<section className='w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 my-10 px-6'>
					<div className='flex-1'>
						<h2 className='text-2xl md:text-3xl flex items-center justify-center gap-2 mb-3 font-fraunces font-extrabold'>
							You're not alone.
						</h2>
						<p className='text-[0.95rem] leading-6'>
							If you've got broad shoulders, a strong upper body,
							and narrow hips — you're likely an{' '}
							<span className='font-semibold'>
								inverted triangle
							</span>
							.<br />
							And most outfit ideas just aren't made with you in
							mind.
						</p>
					</div>
					<div className='flex-1 flex justify-end items-center'>
						<div className='overflow-hidden w-full max-w-xs rounded-md'>
							<Image
								src='/assets/landing-page/silhouette-nobg.png'
								alt='Woman on sofa'
								width={300}
								height={400}
								className='w-60 h-auto object-cover rounded-md bg-transparent'
							/>
						</div>
					</div>
				</section>

				{/* Founder Story Section */}
				<div className='w-full max-sm:w-[90%] mx-auto shadow-lg rounded-md max-w-6xl mt-10'>
					<section className='w-full max-w-6xl mb-16 mx-auto'>
						<h2 className='text-center text-[1.5rem] md:text-3xl text-primary font-extrabold font-fraunces mb-4 bg-[#ad4c5c] py-4 rounded-t-md'>
							From Frustration to Function:
							<br />
							Why I Built Capsulify?
						</h2>
						<div className='flex flex-col md:flex-row justify-between items-center p-4 md:p-8 gap-8 md:gap-12 px-8'>
							{/* Image */}
							<div className='flex-1 flex justify-center items-start'>
								<div className='rounded-md overflow-hidden shadow-lg w-full max-w-xs md:max-w-sm'>
									<Image
										src='/assets/landing-page/founder-img.jpg'
										alt='Ayuni and team'
										width={300}
										height={500}
										className='w-full h-auto object-cover'
									/>
								</div>
							</div>
							{/* Text */}
							<div className='flex-1 text-accent font-inter text-[0.95rem]'>
								<p className='mb-6 leading-6'>
									Hi, I'm Ayuni, founder of Capsulify, and an
									inverted triangle. That means I'm broader at
									the top and narrower at the hips and styling
									myself has always been tricky. Clothes that
									look great on others often make me look
									bulky or off-balance. I never knew why until
									I learned about body shapes.
								</p>
								<p className='mb-6 leading-6'>
									So I tried to fix it the "right" way:
									<br />I bought capsule wardrobe books.
									Followed the formulas. Bought every
									recommended piece - tops, bottoms, shoes,
									bags. But when it came time to create
									outfits? I was squinting at a table of text
									instructions trying to figure out what goes
									with what. I thought,{' '}
									<em className='font-semibold'>
										Why isn't there an app for this?
									</em>
								</p>
								<p className='mb-6 leading-6'>
									And the advice itself? Cookie-cutter. One
									stylist claimed,{' '}
									<em className='font-semibold'>
										"Skinny jeans flatter everyone."
									</em>{' '}
									Not me.
								</p>
								<p className='mb-6 leading-6'>
									I turned to Pinterest and Instagram for
									outfit ideas, but what looked effortless on
									influencers rarely worked for my body. I
									spent too much money chasing other people's
									style, only to feel like an imposter in my
									own clothes.
								</p>
								<p className='mb-6 leading-6'>
									I tried every fashion app I could find but
									they were overwhelming. Too many features,
									too much content, too focused on shopping.
									They assumed I wanted to be a fashionista. I
									didn't. I just wanted to look good with{' '}
									<em className='font-semibold'>fewer</em>{' '}
									clothes, not buy more.
								</p>
								<p className='mb-6 leading-6'>
									So I decided to build what I couldn't find
									with two friends, Martin and Aditi.
									Capsulify is the tool I wish I had years
									ago.
								</p>
								<p className='mb-6 leading-6'>
									It helps you create a capsule wardrobe that
									works with{' '}
									<em className='font-semibold'>your</em> body
									shape, for{' '}
									<em className='font-semibold'>your</em>{' '}
									lifestyle, and{' '}
									<em className='font-semibold'>from</em> the
									clothes you already own. No fluff. No
									pressure to shop. Just smart, personalized
									outfit planning done for you.
								</p>
								<p className='mb-6 leading-6'>
									This isn't about dressing like someone else.
									<br />
									It's about finally dressing like{' '}
									<em className='font-semibold'>you</em>.
								</p>
								<p className='mt-6 text-[0.9rem] font-semibold leading-6'>
									<em>Ayuni</em>
									<br />
									Founder, Capsulify
								</p>
							</div>
						</div>
					</section>
				</div>

				{/* Feelings Section */}
				<div className='w-full max-sm:w-[90%] mx-auto bg-secondary rounded-md mt-20 pb-6 shadow-md max-w-6xl'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-primary bg-[#ad4c5c] py-4 font-extrabold font-fraunces rounded-t-md'>
						You Don't Want More Clothes.
						<br />
						You Want <em>These</em> Feelings.
					</h2>
					<section className='w-full py-10'>
						<div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
							{/* 1 */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.2rem]'>
									<span className=''>
										<em className='font-semibold'>
											"I want to feel soft, feminine, and
											graceful."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									You want clothes that balance your athletic
									shoulders and bring out your waist, hips,
									and curves — without looking harsh or
									masculine.
								</p>
							</div>
							{/* 2 */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.2rem]'>
									<span className=''>
										<em className='font-semibold'>
											"I want my clothes to work with my
											shape, not against it."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									You want outfits that effortlessly flatter —
									where every cut, neckline, and proportion
									feels intentional, not like guesswork.
								</p>
							</div>
							{/* 3 */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.2rem]'>
									<span className=''>
										<em className='font-semibold'>
											"I want to feel confident and
											pulled-together without trying too
											hard."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									You want to look{' '}
									<em className='font-semibold'>
										stylish without overthinking it
									</em>{' '}
									— to be that woman who always looks
									just-put-together even in simple clothes.
								</p>
							</div>
							{/* 4 */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.2rem]'>
									<span className=''>
										<em className='font-semibold'>
											"I want compliments that feel
											sincere, not forced."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									You want people to say,{' '}
									<em className='font-semibold'>
										"You look amazing — that outfit really
										suits you,"
									</em>{' '}
									and know it's because the styling is finally
									right for your body.
								</p>
							</div>
							{/* 5 */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.2rem]'>
									<span className=''>
										<em className='font-semibold'>
											"I want to be able to dress for any
											occasion effortlessly."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									Whether it's work, dates, social events, or
									weekends, you want a wardrobe that truly
									fits your life — and always makes you feel
									like your best self.
								</p>
							</div>
							{/* 6 */}
							<div>
								<p className='font-semibold mb-1 flex items-center gap-1 text-[1.2rem]'>
									<span className=''>
										<em className='font-semibold'>
											"I want to love looking in the
											mirror again."
										</em>
									</span>
								</p>
								<p className='text-[0.95rem] leading-6 mt-2'>
									You want to feel good every morning — not
									defeated before the day even begins. You
									want dressing to be a{' '}
									<em className='font-semibold'>joy</em>, not
									a chore.
								</p>
							</div>
						</div>
					</section>
				</div>

				{/* eBook Section */}
				<EbookSection />

				{/* Closet That Works Section */}
				<div className='shadow-lg rounded-md pb-6 mb-10 w-[91%] max-sm:w-[90%] mx-auto my-10 mt-20'>
					<div className='w-full py-3 mx-auto'>
						<h2 className='text-center text-[1.5rem] md:text-3xl text-primary font-extrabold font-fraunces px-4 bg-[#ad4c5c] py-4 rounded-t-md'>
							<p>✨ Finally! </p>A Closet That Works for
							<em>Your </em> Body Shape.
						</h2>
						<p className='text-center text-accent text-md md:text-lg font-semibold pb-3 mt-4'>
							1,000+ Outfit Combinations.{' '}
							<span className='font-bold'>Just 30 Pieces.</span>
						</p>
					</div>

					{/* Outfit Generator Demo Section */}
					<section className='w-full bg-primary py-6'>
						<div className='max-w-5xl mx-auto flex flex-col items-center px-4'>
							<p className='text-accent text-center mb-8 font-medium'>
								Watch how Capsulify builds a 30-piece Capsule!
							</p>
							<video
								controls
								className='w-full max-w-[300px] rounded-2xl shadow-md'
							>
								<source
									src='/assets/landing-page/demo.mp4'
									type='video/mp4'
								/>
								Your browser does not support the video tag.
							</video>
							<a
								href='https://buy.stripe.com/eVq4gA0F70331UqgGafMA02'
								target='_blank'
								rel='noopener noreferrer'
								className='bg-[#f8c255] text-accent cursor-pointer font-extrabold tracking-wide px-8 py-3 rounded-xl mb-8 transition-all duration-300 transform hover:bg-accent/20 hover:scale-105 hover:shadow-lg text-[0.875rem] uppercase mt-10 font-fraunces italic'
							>
								Use Capsulify Now
							</a>
						</div>
					</section>
				</div>

				{/* Features Grid Section */}
				<section className='w-full max-sm:w-[90%] mx-auto bg-primary pb-10'>
					<div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-18 sm:gap-8 px-4'>
						{/* Feature 1 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<video
								controls
								className='w-full max-w-[300px] rounded-md shadow-md mb-4 border-2 border-accent'
								poster='/assets/landing-page/necklines-thumbnail.png'
							>
								<source
									src='/assets/landing-page/necklines.mp4'
									type='video/mp4'
								/>
								Your browser does not support the video tag.
							</video>
							<h3 className='font-bold text-[1.2rem] mb-2 w-full text-center'>
								Learn which sleeves, necklines, and cuts flatter
								inverted triangle shape
							</h3>
							<p className='text-center text-[0.95rem] leading-6'>
								Tired of looking top-heavy in every outfit?
								We'll show you the exact details that soften
								your shoulders and create harmony without hiding
								who you are.
							</p>
						</div>
						{/* Feature 2 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<video
								controls
								className='w-full max-w-[300px] rounded-md shadow-md mb-4 border-2 border-accent'
								poster='/assets/landing-page/bottoms-thumbnail.png'
							>
								<source
									src='/assets/landing-page/bottomcuts.mp4'
									type='video/mp4'
								/>
								Your browser does not support the video tag.
							</video>
							<h3 className='font-bold text-[1.2rem] mb-2 text-center w-full'>
								Get outfit shapes that add volume where you need
								it
							</h3>
							<p className='text-center text-[0.95rem] leading-6'>
								Tired of dresses that fit up top but hang like a
								sack below? Our combinations help you create
								shape—so your hips don't disappear and your
								figure feels complete.
							</p>
						</div>
						{/* Feature 3 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<video
								controls
								className='w-full max-w-[300px] rounded-md shadow-md mb-4 border-2 border-accent'
								poster='/assets/landing-page/wardrobe-thumbnail.png'
							>
								<source
									src='/assets/landing-page/entirewardrobe.mp4'
									type='video/mp4'
								/>
								Your browser does not support the video tag.
							</video>
							<h3 className='font-bold text-[1.2rem] mb-2 text-center w-full'>
								Edit and explore outfit combinations from a
								curated starter wardrobe
							</h3>
							<p className='text-center text-[0.95rem] leading-6'>
								No more trial and error. Mix and match tops,
								dresses, and cuts tailored for your shape so you
								can stop guessing and start glowing.
							</p>
						</div>
						{/* Feature 4 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<video
								controls
								className='w-[92%] max-w-[300px] rounded-md shadow-md mb-4 border-2 border-accent'
								poster='/assets/landing-page/combos-thumbnail.png'
							>
								<source
									src='/assets/landing-page/combos.mp4'
									type='video/mp4'
								/>
								Your browser does not support the video tag.
							</video>
							<h3 className='font-bold text-[1.2rem] mb-2 text-center w-full'>
								See outfits built to balance your body. Not bury
								it
							</h3>
							<p className='text-center text-[0.95rem] leading-6'>
								You don't need to hide under boxy layers. You
								need smarter proportions. These looks are
								designed to bring balance and beauty to your
								natural frame.
							</p>
						</div>
					</div>
				</section>

				{/* Wardrobe Feels Section */}
				<div className='w-full max-sm:w-[90%] mx-auto bg-secondary mt-10 pb-6 shadow-md max-w-6xl mb-15'>
					<div className='w-full'>
						<h2 className='text-center text-[1.6rem] md:text-3xl text-primary font-extrabold font-fraunces font-inter bg-[#ad4c5c] py-4 rounded-t-md px-2'>
							What It Feels Like When Your Wardrobe Finally Works{' '}
							<em>for</em> You
						</h2>
					</div>
					<section className='w-full'>
						<div className='w-full py-10'>
							<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
								<div className='flex items-start'>
									<span
										aria-hidden='true'
										className='mr-2 text-xl'
									>
										●
									</span>
									<span className='text-accent font-inter text-[1rem]'>
										Wake up knowing exactly what to wear —
										and loving how it looks on you
									</span>
								</div>
								<div className='flex items-start'>
									<span
										aria-hidden='true'
										className='mr-2 text-xl'
									>
										●
									</span>
									<span className='text-accent font-inter text-[1rem]'>
										Look completely different every day,
										using just 30 smart pieces
									</span>
								</div>
								<div className='flex items-start'>
									<span
										aria-hidden='true'
										className='mr-2 text-xl'
									>
										●
									</span>
									<span className='text-accent font-inter text-[1rem]'>
										Feel elegant on dates, commanding at
										work, and effortlessly stylish on
										weekends
									</span>
								</div>
								<div className='flex items-start'>
									<span
										aria-hidden='true'
										className='mr-2 text-xl'
									>
										●
									</span>
									<span className='text-accent font-inter text-[1rem]'>
										Get real compliments — not "you look
										nice," but{' '}
										<em>
											"that outfit is stunning on you"
										</em>
									</span>
								</div>
								<div className='flex items-start'>
									<span
										aria-hidden='true'
										className='mr-2 text-xl'
									>
										●
									</span>
									<span className='text-accent font-inter text-[1rem]'>
										Save thousands by buying <em>less</em>{' '}
										but wearing <em>more</em>
									</span>
								</div>
								<div className='flex items-start'>
									<span
										aria-hidden='true'
										className='mr-2 text-xl'
									>
										●
									</span>
									<span className='text-accent font-inter text-[1rem]'>
										No more panic shopping, style ruts, or
										outfit regrets. Just confidence,
										clarity, and compliments
									</span>
								</div>
							</div>
						</div>
					</section>
				</div>

				{/* Capsulify is for you if... Section */}
				<div className='w-full max-sm:w-[90%] mx-auto py-3'>
					<h2 className='text-center text-[1.8rem] md:text-4xl text-accent font-extrabold font-fraunces'>
						Capsulify is for YOU if...
					</h2>
				</div>
				<section className='w-full bg-primary py-10 flex flex-col items-center'>
					<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
						<div className='flex items-start'>
							<span aria-hidden='true' className='mr-2 text-md'>
								●
							</span>
							<span className='text-accent font-inter text-[1rem]'>
								You have lots of clothes, but feel like you wear
								the same few things
							</span>
						</div>
						<div className='flex items-start'>
							<span aria-hidden='true' className='mr-2 text-md'>
								●
							</span>
							<span className='text-accent font-inter text-[1rem]'>
								You want to look good on dates, workdays, and
								weekends effortlessly
							</span>
						</div>
						<div className='flex items-start'>
							<span aria-hidden='true' className='mr-2 text-md'>
								●
							</span>
							<span className='text-accent font-inter text-[1rem]'>
								You're not a fashionista, but you still want to
								dress well for <em>your</em> shape
							</span>
						</div>
						<div className='flex items-start'>
							<span aria-hidden='true' className='mr-2 text-md'>
								●
							</span>
							<span className='text-accent font-inter text-[1rem]'>
								You don't want to pay $200+ for a stylist every
								season
							</span>
						</div>
					</div>
					<a
						href='https://buy.stripe.com/eVq4gA0F70331UqgGafMA02'
						target='_blank'
						rel='noopener noreferrer'
						className='bg-[#f8c255] mx-auto my-6 text-accent cursor-pointer font-extrabold tracking-wide px-8 py-3 rounded-xl mb-8 transition-all duration-300 transform hover:bg-accent/20 hover:scale-105 hover:shadow-lg text-[0.875rem] uppercase font-fraunces italic'
					>
						Play with Capsulify Now
					</a>
				</section>

				{/* FAQ Section */}
				<div className='shadow-lg rounded-md pb-6 mb-10 max-sm:w-[90%] mx-auto'>
					<div className=' pb-3'>
						<h2 className='text-center text-[1.5rem] md:text-3xl text-primary font-extrabold font-fraunces bg-[#ad4c5c] py-4 rounded-t-md'>
							FAQs
						</h2>
					</div>
					<section className='w-full'>
						<div className='w-full py-10'>
							<div className='max-w-6xl text-accent mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-12 px-6'>
								{/* Column 1 */}
								<FAQColumn
									faqs={[
										{
											q: `I don't want to look like I'm using a robot to dress myself.`,
											a: (
												<span>
													Nor should you.
													<br />
													Capsulify isn't a rigid
													formula — it's a
													stylist-in-your-pocket that
													works with{' '}
													<strong>your</strong> rules.
													<br />
													<br />
													Hate sleeveless tops? We'll
													never suggest them.
													<br />
													Love showing legs but not
													arms? We'll factor that in.
													<br />
													This is <em>your</em> taste,
													your body, your life — not
													ours.
												</span>
											),
										},
										{
											q: `Don't you do for other body shapes?`,
											a: (
												<span>
													<strong>
														Not yet — but we will.
													</strong>{' '}
													Right now, Capsulify is
													optimized for{' '}
													<strong>
														inverted triangle women
													</strong>{' '}
													(broader shoulders, narrower
													hips). That's the shape our
													engine currently supports
													with curated cuts, outfit
													rules, and proportions that
													actually work.
													<br />
													<br />
													But we're not stopping
													there.
													<br />
													<br />
													Our goal is to support{' '}
													<strong>
														all major body shapes
													</strong>{' '}
													— including pear, rectangle,
													hourglass, and apple — with
													the same level of detail and
													care. We're rolling them out
													one at a time to ensure{' '}
													<em>real accuracy</em>, not
													generic templates.
													<br />
													<br />
													If your body shape isn't
													supported yet:
													<ul
														style={{
															marginTop: 8,
															marginBottom: 8,
														}}
													>
														<li>
															You can still
															explore the free
															version
														</li>
														<li>
															Or join the waitlist
															to be notified when
															yours launches
														</li>
														<li>
															Or better yet — sign
															up to help us test
															your shape early
														</li>
													</ul>
													We're building this with
													real women in mind — one
													shape at a time.
												</span>
											),
										},
										{
											q: `What if I don't know my style yet?`,
											a: (
												<span>
													That's actually the best
													time to use Capsulify.
													<br />
													<br />
													You don't need a defined
													personal style to start — in
													fact, Capsulify helps you{' '}
													<strong>
														discover it
													</strong>{' '}
													by showing you which outfit
													combinations you naturally
													gravitate toward.
													<br />
													<br />
													You'll start with just a few
													preferences (minimal,
													feminine, elegant, etc.),
													and as you mix and match
													outfits from your own
													wardrobe, you'll start to
													see patterns — <em>
														that
													</em>{' '}
													is your emerging style.
													<br />
													<br />
													Think of it as learning your
													style by wearing it, not
													guessing it.
												</span>
											),
										},
										{
											q: `What if I don't know my body shape?`,
											a: (
												<span>
													You're not alone — most
													women aren't 100% sure.
													<br />
													<br />
													Here's a simple way to
													figure it out right now:
													<br />
													<strong>
														Stand in front of a
														mirror and look at your
														shoulder line and hip
														line.
													</strong>
													<ul
														style={{
															marginTop: 8,
															marginBottom: 8,
														}}
													>
														<li>
															If your shoulders
															are noticeably wider
															than your hips,
															you're likely an{' '}
															<strong>
																inverted
																triangle
															</strong>
															.
														</li>
														<li>
															If your hips are
															wider than your
															shoulders, you may
															be a{' '}
															<strong>
																pear
															</strong>
															.
														</li>
														<li>
															If they're about the
															same and you have a
															defined waist, you
															might be an{' '}
															<strong>
																hourglass
															</strong>
															.
														</li>
														<li>
															If your waist isn't
															very defined, you
															could be a{' '}
															<strong>
																rectangle or
																apple
															</strong>
															.
														</li>
													</ul>
													We're currently focusing on
													inverted triangle shapes —
													but we're also building a
													camera-based tool to help
													determine your shape
													visually, without guesswork.
													<br />
													<br />
													And don't worry: you can
													always update your shape
													later inside the app. Just
													pick the closest match and
													start — perfection isn't
													required to see results.
												</span>
											),
										},
										{
											q: `I hate uploading clothes. This sounds like work.`,
											a: (
												<span>
													Totally fair. That's why we
													made it fast.
													<br />
													You can:
													<ul
														style={{
															marginTop: 8,
															marginBottom: 8,
														}}
													>
														<li>
															Choose from visual
															templates
														</li>
														<li>Auto-tag items</li>
														<li>
															Or just start with
															10–15 core pieces
															and still get dozens
															of looks. 30 mins
															and you're done.
														</li>
													</ul>
													You don't need to upload
													your whole closet on Day 1.
												</span>
											),
										},
									]}
									columnKey='col1'
								/>
								{/* Column 2 */}
								<FAQColumn
									faqs={[
										{
											q: `Do I need to upload my entire closet?`,
											a: (
												<span>
													Nope — definitely not.
													<br />
													<br />
													You can start with just a
													few pieces:
													<br />
													<strong>
														2–4 tops, 2 bottoms, a
														pair of shoes — and
														you're good to go.
													</strong>
													<br />
													Capsulify will already start
													generating outfit ideas
													based on those.
													<br />
													<br />
													The more you add, the
													smarter and more
													personalized the outfit
													suggestions become. But
													there's no need to upload
													your entire wardrobe on Day
													1.
													<br />
													<br />
													Start small. Build as you
													go. We designed it that way
													on purpose — to be useful
													even when your closet is
													still half-loaded.
												</span>
											),
										},
										{
											q: `Do I have to have 30 pieces?`,
											a: (
												<span>
													Not at all.
													<br />
													<br />
													30 pieces is just a{' '}
													<strong>
														starting framework
													</strong>
													, not a requirement.
													<br />
													You can begin with as few as
													6–10 items and still see
													useful outfit combinations.
													Some women start with even
													less, especially if they're
													building their capsule from
													scratch.
													<br />
													<br />
													Capsulify is designed to
													work with{' '}
													<em>whatever you have</em> —
													whether that's a full closet
													or a handful of go-to
													staples. You can add more
													pieces over time as your
													wardrobe (or confidence)
													grows.
													<br />
													<br />
													No pressure. No minimum.
													Just smarter styling from
													wherever you're starting.
												</span>
											),
										},
										{
											q: `Is this for people in hot climates? Where are the boots and winter jackets?`,
											a: (
												<span>
													Yes — Capsulify is currently
													built for{' '}
													<strong>
														warm and tropical
														climates
													</strong>
													, like Singapore, Malaysia,
													and Southeast Asia.
													<br />
													<br />
													That means you'll mostly see
													outfit combinations using
													light fabrics, breathable
													materials, and pieces suited
													for heat and humidity. We
													intentionally left out bulky
													coats and winter layers —
													because most of our early
													users don't need them day to
													day.
													<br />
													<br />
													<strong>
														That said, a
														cold-weather capsule is
														coming.
													</strong>
													<br />
													If you live in a four-season
													country or need a packing
													list for winter travel, stay
													tuned — we're building
													modules that will handle
													layering, boots, and
													seasonal swaps soon.
													<br />
													<br />
													For now, think of this as
													your year-round summer
													wardrobe planner — optimized
													for real heat, not just
													aesthetic sun-drenched
													Instagram shots.
												</span>
											),
										},
										{
											q: `Will the app suggest clothes I don't own?`,
											a: (
												<span>
													Yes — but only if they're
													pieces that{' '}
													<strong>
														flatter your body shape
													</strong>{' '}
													and fit your style
													preferences.
													<br />
													<br />
													Capsulify's job isn't just
													to work with what you have —
													it's also to show you{' '}
													<strong>
														what you're missing
													</strong>
													. If there's a key piece
													that would work beautifully
													for your shape and you don't
													own it yet, we'll suggest
													it.
													<br />
													<br />
													We believe in helping you
													shop smarter, not more.
													<br />
													If a certain skirt cut or
													neckline consistently
													flatters your shape, you{' '}
													<em>should</em> own one —
													and we'll tell you why.
													<br />
													<br />
													The goal is to fill your
													wardrobe with the{' '}
													<strong>
														right pieces
													</strong>
													, not just more pieces.
												</span>
											),
										},
									]}
									columnKey='col2'
								/>
							</div>
						</div>
					</section>
				</div>

				{/* What You'll Get Section */}
				<section className='w-full py-10'>
					<div className=' flex flex-col items-center'>
						<h2 className='w-full text-center text-[1.8rem] md:text-4xl font-extrabold font-fraunces mb-2 bg-[#ad4c5c] text-primary py-6'>
							What You'll Get
						</h2>
						<h3 className='text-center font-bold text-lg md:text-xl mb-2 font-inter flex items-center justify-center gap-2'>
							<span aria-hidden='true' className='mr-2 text-xl'>
								🎁
							</span>{' '}
							Your Lifetime Deal:{' '}
							<span className=' text-[1.1rem] font-bold'>
								$99 One-Time
							</span>
						</h3>
						<p className='text-center font-semibold text-sm md:text-lg mb-8 font-inter'>
							Exclusive Perks for Founding Users
						</p>
						<div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4'>
							<div className='flex items-start gap-2'>
								<span className=' text-[1.1rem]'>
									● Be a co-creator: help shape features, test
									updates, and influence design
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span className=' font-inter text-[1.1rem]'>
									● Get priority access to new modules (before
									the public)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span className=' font-inter text-[1.1rem]'>
									● Receive VIP invites to future workshops &
									styling webinars
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span className=' font-inter text-[1.1rem]'>
									● Be featured in our early user showcase
									(optional)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span className=' font-inter text-[1.1rem]'>
									● Lifetime pricing locked in — this tier
									will never open again
								</span>
							</div>
						</div>
						<a
							href='https://buy.stripe.com/eVq4gA0F70331UqgGafMA02'
							target='_blank'
							rel='noopener noreferrer'
							className='bg-[#f8c255] text-accent cursor-pointer font-extrabold px-10 py-3 rounded-xl mb-8 transition-all duration-300 transform hover:bg-accent/20 hover:scale-105 hover:shadow-lg text-[0.875rem] uppercase my-10'
						>
							<em>Get instant access</em>
						</a>
					</div>
				</section>

				{/* What You Get With This Lifetime Deal Section */}
				<section className='w-full bg-[#ad4c5c] text-white py-8'>
					<div className='flex flex-col items-center'>
						<h2 className='text-center text-[1.8rem] md:text-4xl text-primary font-extrabold font-fraunces px-2'>
							What You Get With This Lifetime Deal
						</h2>
						<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-8 mt-8 px-4'>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl text-[white]'
								>
									✔
								</span>
								<span className=' font-inter text-sm'>
									Build Your Own Capsule Closet (tag by
									category, color, occasion)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl text-white'
								>
									✔
								</span>
								<span className=' font-inter text-[1rem]'>
									Personalized Fit Guide for Your Body Shape
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl text-white'
								>
									✔
								</span>
								<span className=' font-inter text-[1rem]'>
									1,000+ Outfits Generated Based on Lifestyle
									& Weather
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl text-white'
								>
									✔
								</span>
								<span className=' font-inter text-[1rem]'>
									Outfit Suggestions by Occasion, Time of Day,
									Climate
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl text-white'
								>
									✔
								</span>
								<span className=' font-inter text-[1rem]'>
									Works on Mobile – no app install needed
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span className=' font-inter text-[1rem] italic'>
									<span className=' font-extrabold text-[1rem]'>
										Coming Soon:
									</span>{' '}
									Filter your outfits by weather, climate,
									time of day, recommendation by height,
									clothes by skin tone, links to buy
									recommended clothes, and any feature YOU
									want.
								</span>
							</div>
						</div>
						<div className='w-full flex flex-col items-center my-12 px-4'>
							<h3 className='text-center font-bold text-xl md:text-2xl mb-2 font-inter flex items-center justify-center gap-2 border-b-4 py-2 px-2 border-[#f8c255]'>
								🔒Only 100 Spots. Offer Ends 30th June 2025
							</h3>
							<p className='text-center text-[1rem] mb-2'>
								This is your{' '}
								<span className='font-bold'>only chance</span>{' '}
								to get lifetime access for just{' '}
								<span className='font-bold'>$99</span> — no
								monthly fees, no hidden upsells, no gimmicks.
							</p>
							<p className='text-center text-[1rem]'>
								You'll get{' '}
								<span className='font-bold'>
									1,000+ outfit combinations
								</span>{' '}
								tailored <em>just</em> for your body shape —
								with styling logic and edits you can trust.
							</p>
						</div>
						<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-4 px-4'>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl'
								>
									✔
								</span>
								<span className='text-primary font-inter text-[1rem]'>
									Wake up knowing exactly what to wear — and
									loving how it looks on you
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl'
								>
									✔
								</span>
								<span className='text-primary font-inter text-[1rem]'>
									Your own{' '}
									<span className='font-bold'>
										editable Fit Guide
									</span>
									, tailored to your body shape
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl'
								>
									✔
								</span>
								<span className='text-primary font-inter text-[1rem]'>
									<span className='font-bold'>
										Styling logic built-in
									</span>{' '}
									— no second-guessing combinations
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl'
								>
									✔
								</span>
								<span className='text-primary font-inter text-[1rem]'>
									Access to{' '}
									<span className='font-bold'>
										premium add-on upgrades
									</span>{' '}
									(only if you want them)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									aria-hidden='true'
									className='mr-2 text-xl'
								>
									✔
								</span>
								<span className='text-primary font-inter text-[1rem]'>
									<span className='font-bold'>
										Zero monthly fees.
									</span>{' '}
									Ever.
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* Not sure if this is for you? Section */}
				<section className='w-full pt-8 pb-20'>
					<h2 className='text-center text-[1.8rem] md:text-4xl text-accent font-extrabold font-fraunces px-2'>
						Not sure if this is for you?
					</h2>
					<div className='max-w-4xl mx-auto rounded-lg shadow-none md:shadow-none px-6 py-12 mb-4'>
						<p className='text-accent text-center text-[1.2rem] mb-2 font-inter w-[80%] md:w-[50%] mx-auto leading-7'>
							<span className='font-bold'>Try it risk-free.</span>
							<br />
							<span className='text-[1rem]'>
								If Capsulify isn't helping you feel confident
								and stylish within 30 days, we'll refund you —
								no hard feelings.
							</span>
						</p>
					</div>
					<div className='flex justify-center'>
						<div className='bg-secondary rounded-md shadow-md px-8 py-8 flex flex-col items-center w-[80%] md:w-[50%]'>
							<p className='text-accent text-center mb-4 font-semibold'>
								Limited to the First 100 users!
							</p>
							<a
								href='https://buy.stripe.com/eVq4gA0F70331UqgGafMA02'
								target='_blank'
								rel='noopener noreferrer'
								className='bg-[#f8c255] text-accent cursor-pointer font-extrabold tracking-wide px-8 py-3 rounded-xl mb-8 transition-all duration-300 transform hover:bg-accent/20 hover:scale-105 hover:shadow-lg text-[0.875rem] uppercase'
							>
								<em>Get instant access</em>
							</a>
							<CountdownTimer />
						</div>
					</div>
				</section>
			</main>
			{/* Footer */}
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

export default page
