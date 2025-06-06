'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

// Types for FAQ
interface FAQ {
	q: string
	a: string
}

interface FAQColumnProps {
	faqs: FAQ[]
	columnKey: string
}

interface FAQItemProps {
	question: string
	answer: string
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
				<span className='flex-1'>{question}</span>
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

const page = () => {
	return (
		<div className='min-h-screen bg-primary text-accent font-inter flex flex-col'>
			{/* Header */}
			<header className='fixed top-0 left-0 right-0 w-full flex items-center justify-between px-2 md:px-6 py-4 bg-primary z-50 shadow-lg'>
				<div className='flex items-center gap-1 cursor-pointer hover:bg-accent/20 rounded-lg px-1 md:px-2 py-1 transition-colors flex-1 justify-start'>
					<Image
						src='/assets/images/logo/logo.svg'
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
					<button className='max-sm:text-[0.85rem] text-[0.875rem] cursor-pointer bg-accent hover:bg-accent/80 text-primary font-semibold px-8 py-2 max-sm:px-4 max-sm:py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.08] active:scale-[0.98]'>
						Get instant access
					</button>
				</nav>
			</header>

			{/* Main Content */}
			<main className='flex-1 flex flex-col items-center px-0 pt-17 max-sm:pt-15'>
				{/* Top Section */}
				<div className='w-full pt-8'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter px-1.5'>
						Tired of Dressing for a Body Shape that Fashion Forgot?
					</h2>
				</div>
				<section className='w-full max-w-5xl mt-10 mx-auto px-4'>
					<p className='text-md md:text-lg mb-8 text-accent/80'>
						If you've ever looked in the mirror and thought:
					</p>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{/* Boxy */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='thinking'>
									🤔
								</span>
								<span className=''>
									<em>"Everything looks boxy on me."</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								Tops and jackets often feel like they hang
								straight from the shoulders, creating a blocky
								silhouette with no waist definition.
							</p>
						</div>
						{/* Sleeveless */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='thinking'>
									🤔
								</span>
								<span className=''>
									<em>
										"I hate how sleeveless tops make me
										look."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								Strapless, halters, and thin-strapped tops can
								exaggerate broad shoulders, making you feel
								masculine or top-heavy even when the style is
								feminine.
							</p>
						</div>
						{/* Jeans */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='thinking'>
									🤔
								</span>
								<span className=''>
									<em>"My jeans never balance me out."</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								No matter how much you love skinny jeans, they
								often emphasize the narrowness of your hips —
								making your upper body look even wider in
								contrast.
							</p>
						</div>
						{/* Dresses */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='thinking'>
									🤔
								</span>
								<span className=''>
									<em>"Dresses just don't fit right."</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								Dresses often either cling weirdly at the top or
								float shapelessly, leaving you feeling
								unstructured or overwhelmed by fabric.
							</p>
						</div>
						{/* Blazers */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='thinking'>
									🤔
								</span>
								<span className=''>
									<em>
										"Blazers make me look like a bouncer."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								Structured outerwear, especially with shoulder
								pads, can push your proportions even further out
								of balance.
							</p>
						</div>
						{/* Feminine */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='thinking'>
									🤔
								</span>
								<span className=''>
									<em>
										"I feel like I can never look soft or
										feminine."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								Fashion often tells you to "embrace your strong
								frame," but it rarely teaches you how to create
								softness, movement, or curve in your outfits —
								so you give up and default to basics.
							</p>
						</div>
					</div>
				</section>

				{/* Bottom Section */}
				<section className='w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 my-20 px-4'>
					<div className='flex-1'>
						<h2 className='text-xl md:text-2xl font-semibold flex items-center gap-2 mb-3'>
							<span role='img' aria-label='purple flower'>
								🫂
							</span>
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
						<div className='overflow-hidden shadow-lg w-full max-w-xs'>
							<Image
								src='/assets/inverted-triangle/beige_blazer.png'
								alt='Woman on sofa'
								width={400}
								height={500}
								className='w-full h-auto object-cover rounded-md'
							/>
						</div>
					</div>
				</section>

				{/* Founder Story Section */}
				<div className='w-full py-3'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter'>
						From Frustration to Function:
						<br />
						Why I Built Capsulify?
					</h2>
				</div>
				<section className='w-full max-w-6xl mt-8 mb-16 mx-auto'>
					<div className='flex flex-col md:flex-row justify-between items-center bg-primary p-4 md:p-8 gap-8 md:gap-12'>
						{/* Image */}
						<div className='flex-1 flex justify-center items-start'>
							<div className='rounded-xl overflow-hidden shadow-lg w-full max-w-xs md:max-w-sm'>
								<Image
									src='/assets/inverted-triangle/black_blazer.png'
									alt='Ayuni and team'
									width={400}
									height={600}
									className='w-full h-auto object-cover'
								/>
							</div>
						</div>
						{/* Text */}
						<div className='flex-1 text-accent font-inter text-[0.95rem]'>
							<p className='mb-3 leading-6'>
								Hi, I'm Ayuni, founder of Capsulify, and an
								inverted triangle. That means I'm broader at the
								top and narrower at the hips and styling myself
								has always been tricky. Clothes that look great
								on others often make me look bulky or
								off-balance. I never knew why until I learned
								about body shapes.
							</p>
							<p className='mb-3 leading-6'>
								So I tried to fix it the "right" way:
								<br />I bought capsule wardrobe books. Followed
								the formulas. Bought every recommended piece -
								tops, bottoms, shoes, bags. But when it came
								time to create outfits? I was squinting at a
								table of text instructions trying to figure out
								what goes with what. I thought,{' '}
								<em className='font-semibold'>
									Why isn't there an app for this?
								</em>
							</p>
							<p className='mb-3 leading-6'>
								And the advice itself? Cookie-cutter. One
								stylist claimed,{' '}
								<em className='font-semibold'>
									"Skinny jeans flatter everyone."
								</em>{' '}
								Not me.
							</p>
							<p className='mb-3 leading-6'>
								I turned to Pinterest and Instagram for outfit
								ideas, but what looked effortless on influencers
								rarely worked for my body. I spent too much
								money chasing other people's style, only to feel
								like an imposter in my own clothes.
							</p>
							<p className='mb-3 leading-6'>
								I tried every fashion app I could find but they
								were overwhelming. Too many features, too much
								content, too focused on shopping. They assumed I
								wanted to be a fashionista. I didn't. I just
								wanted to look good with{' '}
								<em className='font-semibold'>fewer</em>{' '}
								clothes, not buy more.
							</p>
							<p className='mb-3 leading-6'>
								So I decided to build what I couldn't find with
								two friends, Martin and Aditi. Capsulify is the
								tool I wish I had years ago.
							</p>
							<p className='mb-3 leading-6'>
								It helps you create a capsule wardrobe that
								works with{' '}
								<em className='font-semibold'>your</em> body
								shape, for{' '}
								<em className='font-semibold'>your</em>{' '}
								lifestyle, and{' '}
								<em className='font-semibold'>from</em> the
								clothes you already own. No fluff. No pressure
								to shop. Just smart, personalized outfit
								planning done for you.
							</p>
							<p className='mb-3 leading-6'>
								This isn't about dressing like someone else.
								<br />
								It's about finally dressing like{' '}
								<em className='font-semibold'>you</em>.
							</p>
							<p className='mt-6 text-[0.9rem] font-semibold leading-6'>
								Ayuni
								<br />
								Founder, Capsulify
							</p>
						</div>
					</div>
				</section>

				{/* Feelings Section */}
				<div className='w-full py-3'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter'>
						You Don't Want More Clothes.
						<br />
						You Want <em>These</em> Feelings.
					</h2>
				</div>
				<section className='w-full bg-primary py-10'>
					<div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
						{/* 1 */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='sparkle'>
									🧚‍♀️
								</span>
								<span className=''>
									<em className='font-semibold'>
										"I want to feel soft, feminine, and
										graceful."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								You want clothes that balance your athletic
								shoulders and bring out your waist, hips, and
								curves — without looking harsh or masculine.
							</p>
						</div>
						{/* 2 */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='shirt'>
									👚
								</span>
								<span className=''>
									<em className='font-semibold'>
										"I want my clothes to work with my
										shape, not against it."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								You want outfits that effortlessly flatter —
								where every cut, neckline, and proportion feels
								intentional, not like guesswork.
							</p>
						</div>
						{/* 3 */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='sparkle'>
									💁‍♀️
								</span>
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
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='sparkle'>
									💬
								</span>
								<span className=''>
									<em className='font-semibold'>
										"I want compliments that feel sincere,
										not forced."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								You want people to say,{' '}
								<em className='font-semibold'>
									"You look amazing — that outfit really suits
									you,"
								</em>{' '}
								and know it's because the styling is finally
								right for your body.
							</p>
						</div>
						{/* 5 */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='dress'>
									👗
								</span>
								<span className=''>
									<em className='font-semibold'>
										"I want to be able to dress for any
										occasion effortlessly."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								Whether it's work, dates, social events, or
								weekends, you want a wardrobe that truly fits
								your life — and always makes you feel like your
								best self.
							</p>
						</div>
						{/* 6 */}
						<div>
							<p className='font-semibold mb-1 flex items-center gap-1 text-[0.98rem]'>
								<span role='img' aria-label='mirror'>
									🪞
								</span>
								<span className=''>
									<em className='font-semibold'>
										"I want to love looking in the mirror
										again."
									</em>
								</span>
							</p>
							<p className='text-[0.95rem] leading-6 mt-2'>
								You want to feel good every morning — not
								defeated before the day even begins. You want
								dressing to be a{' '}
								<em className='font-semibold'>joy</em>, not a
								chore.
							</p>
						</div>
					</div>
				</section>

				{/* Closet That Works Section */}
				<div className='w-full py-3'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold px-4'>
						<p>✨ Finally! </p>A Closet That Works for
						<em className='text-accent'>Your </em> Body Shape
					</h2>
					<p className='text-center text-accent text-md md:text-lg font-semibold pb-3 font-inter mt-4'>
						1,000+ Outfit Combinations.{' '}
						<span className='font-bold'>Just 30 Pieces.</span>
					</p>
				</div>

				{/* Outfit Generator Demo Section */}
				<section className='w-full bg-primary py-12'>
					<div className='max-w-5xl mx-auto flex flex-col items-center px-4'>
						<p className='text-accent text-center mb-2 font-inter'>
							placeholder: short gif/demo playing of the outfit
							generator in action
						</p>
						<p className='text-accent text-center mb-8 font-inter font-medium'>
							"Watch how Capsulify builds a 30-piece capsule"
						</p>
						<div className='w-full flex justify-center mb-8'>
							<div className='w-full max-w-4xl h-72 md:h-96 bg-gray-100 flex items-center justify-center rounded-md'>
								<svg
									className='w-16 h-16 text-gray-300'
									fill='currentColor'
									viewBox='0 0 64 64'
								>
									<circle
										cx='32'
										cy='32'
										r='32'
										fill='#e5e7eb'
									/>
									<polygon
										points='26,20 48,32 26,44'
										fill='#bdbdbd'
									/>
								</svg>
							</div>
						</div>
						<p className='text-accent text-center font-inter'>
							Preview outfit combos that actually suit your frame.
						</p>
					</div>
				</section>

				{/* Features Grid Section */}
				<section className='w-full bg-primary py-12'>
					<div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4'>
						{/* Feature 1 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<span className='mb-2 text-sm'>
								placeholder: show pic of necklines.
							</span>
							<img
								src='/assets/inverted-triangle/invertedtriangle_accent_plain_cowl_cap_top_blouse.png'
								alt='necklines'
								className='rounded-lg w-full h-60 object-cover mb-4 p-6 border-1 border-accent'
							/>
							<h3 className='font-bold text-[0.95rem] mb-2 text-left w-full'>
								Learn which sleeves, necklines, and cuts flatter
								inverted triangle shape
							</h3>
							<p className='text-left text-[0.95rem] leading-6'>
								Tired of looking top-heavy in every outfit?
								We'll show you the exact details that soften
								your shoulders and create harmony without hiding
								who you are.
							</p>
						</div>
						{/* Feature 2 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<span className='mb-2 text-sm'>
								placeholder: show pic of bottom cuts
							</span>
							<img
								src='/assets/inverted-triangle/invertedtriangle_accent_plain_cowl_cap_top_blouse.png'
								alt='bottom cuts'
								className='rounded-lg w-full h-60 object-cover mb-4 p-6 border-1 border-accent'
							/>
							<h3 className='font-bold text-[0.95rem] mb-2 text-left w-full'>
								Get outfit shapes that add volume where you need
								it
							</h3>
							<p className='text-left text-[0.95rem] leading-6'>
								Tired of dresses that fit up top but hang like a
								sack below? Our combinations help you create
								shape—so your hips don't disappear and your
								figure feels complete.
							</p>
						</div>
						{/* Feature 3 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<span className='mb-2 text-sm'>
								placeholder: show pic of wardrobe
							</span>
							<img
								src='/assets/inverted-triangle/invertedtriangle_accent_plain_cowl_cap_top_blouse.png'
								alt='wardrobe'
								className='rounded-lg w-full h-60 object-cover mb-4 p-6 border-1 border-accent'
							/>
							<h3 className='font-bold text-[0.95rem] mb-2 text-left w-full'>
								Edit and explore outfit combinations from a
								curated starter wardrobe
							</h3>
							<p className='text-left text-[0.95rem] leading-6'>
								No more trial and error. Mix and match tops,
								dresses, and cuts tailored for your shape so you
								can stop guessing and start glowing.
							</p>
						</div>
						{/* Feature 4 */}
						<div className='flex flex-col items-center text-accent font-inter'>
							<span className='mb-2 text-sm'>
								placeholder: show gif of combos.
							</span>
							<img
								src='/assets/inverted-triangle/invertedtriangle_accent_plain_cowl_cap_top_blouse.png'
								alt='combinations'
								className='rounded-lg w-full h-60 object-cover mb-4 p-6 border-1 border-accent'
							/>
							<h3 className='font-bold text-[0.95rem] mb-2 text-left w-full'>
								See outfits built to balance your body. Not bury
								it
							</h3>
							<p className='text-left text-[0.95rem] leading-6'>
								You don't need to hide under boxy layers. You
								need smarter proportions. These looks are
								designed to bring balance and beauty to your
								natural frame.
							</p>
						</div>
					</div>
				</section>

				{/* Wardrobe Feels Section */}
				<div className='w-full py-3'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter px-1'>
						What It Feels Like When Your Wardrobe Finally Works{' '}
						<em>for</em> You
					</h2>
				</div>
				<section className='w-full bg-primary'>
					<div className='w-full bg-primary py-10'>
						<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
							<div className='flex items-start'>
								<span className='mr-2 text-xl'>💃</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Wake up knowing exactly what to wear — and
									loving how it looks on you
								</span>
							</div>
							<div className='flex items-start'>
								<span className='mr-2 text-xl'>💃</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Look completely different every day, using
									just 30 smart pieces
								</span>
							</div>
							<div className='flex items-start'>
								<span className='mr-2 text-xl'>💃</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Feel elegant on dates, commanding at work,
									and effortlessly stylish on weekends
								</span>
							</div>
							<div className='flex items-start'>
								<span className='mr-2 text-xl'>💃</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Get real compliments — not "you look nice,"
									but{' '}
									<em>"that outfit is stunning on you"</em>
								</span>
							</div>
							<div className='flex items-start'>
								<span className='mr-2 text-xl'>💃</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Save thousands by buying <em>less</em> but
									wearing <em>more</em>
								</span>
							</div>
							<div className='flex items-start'>
								<span className='mr-2 text-xl'>💃</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									No more panic shopping, style ruts, or
									outfit regrets. Just confidence, clarity,
									and compliments
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* Capsulify is for you if... Section */}
				<div className='w-full py-3'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter'>
						Capsulify is for YOU if...
					</h2>
				</div>
				<section className='w-full bg-primary py-10'>
					<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
						<div className='flex items-start'>
							<span className='mr-2 text-md'>😕</span>
							<span className='text-accent font-inter text-[0.95rem]'>
								You have lots of clothes, but feel like you wear
								the same few things
							</span>
						</div>
						<div className='flex items-start'>
							<span className='mr-2 text-md'>😣</span>
							<span className='text-accent font-inter text-[0.95rem]'>
								You want to look good on dates, workdays, and
								weekends effortlessly
							</span>
						</div>
						<div className='flex items-start'>
							<span className='mr-2 text-md'>😬</span>
							<span className='text-accent font-inter text-[0.95rem]'>
								You're not a fashionista, but you still want to
								dress well for <em>your</em> shape
							</span>
						</div>
						<div className='flex items-start'>
							<span className='mr-2 text-md'>💸</span>
							<span className='text-accent font-inter text-[0.95rem]'>
								You don't want to pay $200+ for a stylist every
								season
							</span>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<div className='w-full py-3'>
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter'>
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
										q: 'Do I need to upload my entire closet?',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: "What if I don't know my body shape?",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: 'Is this for people in hot climates / Singapore?',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: "Don't you do for other body shapes?",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: "What if I don't know my style yet?",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: 'I am not sure if I will use this long term',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: "Why should I pay now if it's still evolving?",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: 'Can I get a refund if I hate it?',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
								]}
								columnKey='col1'
							/>
							{/* Column 2 */}
							<FAQColumn
								faqs={[
									{
										q: "Will the app suggest clothes I don't own?",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: "I've tried other styling apps. They all sucked. What makes this different?",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: 'I hate uploading clothes. This sounds like work.',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: 'Do I have to have 30 pieces?',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: 'I already use Pinterest / Canva / IG for this.',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: "I'm not tech-savvy.",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: 'This feels expensive.',
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
									{
										q: "I don't want another dead app on my phone.",
										a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet condimentum bibendum. Vivamus ut consectetur leo. Integer ac massa accumsan, rutrum purus quis, tempor ante. Phasellus vel mauris massa.',
									},
								]}
								columnKey='col2'
							/>
						</div>
					</div>
				</section>

				{/* What You'll Get Section */}
				<section className='w-full bg-primary py-16'>
					<div className=' flex flex-col items-center'>
						<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter'>
							What You'll Get
						</h2>
						<h3 className='text-center text-accent font-bold text-lg md:text-xl mb-2 font-inter flex items-center justify-center gap-2'>
							<span role='img' aria-label='gift'>
								🎁
							</span>{' '}
							Your Lifetime Deal:{' '}
							<span className='text-accent text-[1.1rem] font-bold'>
								$99 One-Time
							</span>
						</h3>
						<p className='text-center text-accent font-semibold text-sm md:text-lg mb-8 font-inter'>
							Exclusive Perks for Founding Users
						</p>
						<div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4'>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl'
									role='img'
									aria-label='crown'
								>
									👑
								</span>
								<span className='text-accent text-[0.95rem]'>
									Be a co-creator: help shape features, test
									updates, and influence design
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl'
									role='img'
									aria-label='crown'
								>
									👑
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Get priority access to new modules (before
									the public)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl'
									role='img'
									aria-label='crown'
								>
									👑
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Receive VIP invites to future workshops &
									styling webinars
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl'
									role='img'
									aria-label='crown'
								>
									👑
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Be featured in our early user showcase
									(optional)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl'
									role='img'
									aria-label='crown'
								>
									👑
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Lifetime pricing locked in — this tier will
									never open again
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* What You Get With This Lifetime Deal Section */}
				<section className='w-full bg-primary py-8'>
					<div className='flex flex-col items-center'>
						<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter'>
							What You Get With This Lifetime Deal
						</h2>
						<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-8 mt-8 px-4'>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-purple-700'
									role='img'
									aria-label='check'
								>
									✔️
								</span>
								<span className='text-accent font-inter text-sm'>
									Build Your Own Capsule Closet (tag by
									category, color, occasion)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-purple-700'
									role='img'
									aria-label='check'
								>
									✔️
								</span>
								<span className='text-accent font-inter text-sm'>
									Personalized Fit Guide for Your Body Shape
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-purple-700'
									role='img'
									aria-label='check'
								>
									✔️
								</span>
								<span className='text-accent font-inter text-sm'>
									1,000+ Outfits Generated Based on Lifestyle
									& Weather
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-purple-700'
									role='img'
									aria-label='check'
								>
									✔️
								</span>
								<span className='text-accent font-inter text-sm'>
									Outfit Suggestions by Occasion, Time of Day,
									Climate
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-purple-700'
									role='img'
									aria-label='check'
								>
									✔️
								</span>
								<span className='text-accent font-inter text-sm'>
									Works on Mobile – no app install needed
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span className='text-accent font-inter text-sm italic'>
									<span className='text-accent font-extrabold text-[0.95rem]'>
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
							<h3 className='text-center text-accent font-bold text-xl md:text-2xl mb-2 font-inter flex items-center justify-center gap-2'>
								🔒Only 100 Spots. Offer Ends 30th June 2025
							</h3>
							<p className='text-center text-accent text-[0.875rem] mb-2'>
								This is your{' '}
								<span className='font-bold'>only chance</span>{' '}
								to get lifetime access for just{' '}
								<span className='font-bold'>$99</span> — no
								monthly fees, no hidden upsells, no gimmicks.
							</p>
							<p className='text-center text-accent text-[0.875rem]'>
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
									className='text-xl text-green-600'
									role='img'
									aria-label='check'
								>
									✅
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Wake up knowing exactly what to wear — and
									loving how it looks on you
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-green-600'
									role='img'
									aria-label='check'
								>
									✅
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Your own{' '}
									<span className='font-bold'>
										editable Fit Guide
									</span>
									, tailored to your body shape
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-green-600'
									role='img'
									aria-label='check'
								>
									✅
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									<span className='font-bold'>
										Styling logic built-in
									</span>{' '}
									— no second-guessing combinations
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-green-600'
									role='img'
									aria-label='check'
								>
									✅
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
									Access to{' '}
									<span className='font-bold'>
										premium add-on upgrades
									</span>{' '}
									(only if you want them)
								</span>
							</div>
							<div className='flex items-start gap-2'>
								<span
									className='text-xl text-green-600'
									role='img'
									aria-label='check'
								>
									✅
								</span>
								<span className='text-accent font-inter text-[0.95rem]'>
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
					<h2 className='text-center text-[1.5rem] md:text-3xl text-accent font-extrabold font-inter'>
						Not sure if this is for you?
					</h2>
					<div className='max-w-4xl mx-auto rounded-lg shadow-none md:shadow-none px-6 py-12 mb-4'>
						<p className='text-accent text-center text-[0.98rem] mb-2 font-inter w-[80%] md:w-[50%] mx-auto leading-7'>
							<span className='font-bold'>Try it risk-free.</span>
							<br />
							<span className='text-[0.95rem]'>
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
							<button className='bg-accent text-primary cursor-pointer font-extrabold tracking-wide px-8 py-3 rounded-xl mb-8 transition-all duration-300 transform hover:bg-accent/20 hover:scale-105 hover:shadow-lg text-[1rem] '>
								Get instant access
							</button>
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
					<div className='flex flex-col items-center mb-2 md:mb-0'>
						<span className='text-accent font-inter text-xs italic'>
							© 2025 Capsulify. All rights reserved.
						</span>
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
