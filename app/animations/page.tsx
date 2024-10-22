'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function AnimationsPage() {
	const [svgFiles, setSvgFiles] = useState<string[]>([]);
	const [displayedSvgs, setDisplayedSvgs] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(false);

	const ITEMS_PER_PAGE = 30;
	const loaderRef = useRef(null);

	const loadMoreSvgs = useCallback(() => {
		if (loading || displayedSvgs.length >= svgFiles.length) {
			return;
		}

		setLoading(true);
		const nextSvgs = svgFiles.slice(displayedSvgs.length, displayedSvgs.length + ITEMS_PER_PAGE);
		setDisplayedSvgs((prev) => {
			return [...prev, ...nextSvgs];
		});
		setLoading(false);
	}, [svgFiles, displayedSvgs, loading]);

	useEffect(() => {
		async function fetchSvgFiles() {
			setLoading(true);
			try {
				const response = await fetch('/api/svgFiles');
				if (!response.ok) {
					throw new Error('Failed to fetch SVG files');
				}
				const files = await response.json();

				setSvgFiles(files);
				setDisplayedSvgs(files.slice(0, ITEMS_PER_PAGE));
			} catch (err) {
				setError('Error loading SVG files. Please try again later.');
				console.error('Error fetching SVG files:', err);
			} finally {
				setLoading(false);
			}
		}
		fetchSvgFiles();
	}, []);

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: '20px',
			threshold: 1.0,
		};

		const observer = new IntersectionObserver((entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				loadMoreSvgs();
			}
		}, options);

		if (loaderRef.current) {
			observer.observe(loaderRef.current);
		}

		return () => {
			if (loaderRef.current) {
				observer.unobserve(loaderRef.current);
			}
		};
	}, [loadMoreSvgs]);

	const filteredSvgs = displayedSvgs.filter((file) => file.toLowerCase().includes(searchTerm.toLowerCase()));

	if (error) {
		return <div className='text-red-500 text-center mt-8'>{error}</div>;
	}

	return (
		<div className='min-h-screen bg-gray-100 text-gray-800'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold mb-8 text-center'>Animated SVG Showcase</h1>
				<div className='mb-8'>
					<input
						type='text'
						placeholder='Search animations...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4'>
					{filteredSvgs.map((file) => (
						<Link key={file} href={`/preview/${file}`} className='flex flex-col items-center group cursor-pointer'>
							<div className='w-16 h-16 bg-white rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm'>
								<object
									type='image/svg+xml'
									data={`/svg/${file}`}
									className='w-8 h-8 group-hover:scale-110 transition-all duration-300 pointer-events-none'
								>
									Your browser does not support SVG
								</object>
							</div>
							<p className='text-xs text-gray-600 text-center mt-2 line-clamp-2'>
								{file.replace('.svg', '').replace(/-/g, ' ')}
							</p>
						</Link>
					))}
				</div>
				<div ref={loaderRef} className='h-10 mt-4'>
					{loading && <p className='text-center'>Loading more SVGs...</p>}
				</div>
			</div>
		</div>
	);
}
