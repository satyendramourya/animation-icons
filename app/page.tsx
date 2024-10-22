import Link from 'next/link';

export default function Home() {
	return (
		<main className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 text-white'>
			<h1 className='text-5xl font-bold mb-8'>Animated SVG Marketplace</h1>
			<p className='text-xl mb-8 text-center max-w-2xl'>
				Discover and purchase high-quality animated SVGs at unbeatable prices. Enhance your projects with eye-catching
				animations!
			</p>
			<Link
				href='/animations'
				className='bg-white text-purple-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-purple-100 transition-colors'
			>
				Explore Animations
			</Link>
		</main>
	);
}
