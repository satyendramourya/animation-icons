'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// import Link from 'next/link';

const getSvgName = (param: string | string[]): string => {
	if (Array.isArray(param)) {
		return param[0] || '';
	}
	return param || '';
};

export default function SVGPreviewPage() {
	const params = useParams();
	const [svgContent, setSvgContent] = useState<string>('');

	const svgName = getSvgName(params.svg);

	useEffect(() => {
		async function fetchSVG() {
			try {
				const response = await fetch(`/svg/${svgName}`);
				const text = await response.text();
				setSvgContent(text);
			} catch (error) {
				console.error('Failed to fetch SVG:', error);
			}
		}
		if (svgName) {
			fetchSVG();
		}
	}, [svgName]);

	const downloadSvg = () => {
		const blob = new Blob([svgContent], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = svgName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const copySvgCode = () => {
		navigator.clipboard
			.writeText(svgContent)
			.then(() => {
				alert('SVG code copied to clipboard!');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	};

	return (
		<div className='min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold mb-8'>SVG Preview</h1>
				<div className='flex flex-col lg:flex-row gap-8'>
					<div className='w-full lg:w-2/3'>
						<div className='bg-white p-8 rounded-lg shadow-md'>
							<div className='h-52 flex items-center justify-center'>
								<div
									className='flex items-center justify-center hover:scale-110 transition-all duration-300'
									dangerouslySetInnerHTML={{ __html: svgContent }}
								/>
							</div>
							<div className='flex space-x-4 mt-8'>
								<button
									onClick={downloadSvg}
									className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors'
								>
									Download SVG
								</button>
								<button
									onClick={copySvgCode}
									className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors'
								>
									Copy SVG Code
								</button>
							</div>
						</div>
						<div className='mt-8 bg-white p-8 rounded-lg shadow-md'>
							<h2 className='text-xl font-semibold mb-4'>SVG Code</h2>
							<pre className='p-4 rounded-lg overflow-x-auto text-sm bg-gray-100'>
								<code>{svgContent}</code>
							</pre>
						</div>
					</div>
					<div className='w-full lg:w-1/3'>
						<div className='bg-white p-4 rounded-lg shadow-md mb-8'>
							<h3 className='text-sm font-semibold mb-2'>Sponsored</h3>
							<div className='w-full h-64 bg-gray-200 flex items-center justify-center'>
								<span className='text-gray-400'>300x250 Ad</span>
							</div>
						</div>
						<div className='bg-white p-4 rounded-lg shadow-md'>
							<div className='w-full h-96 bg-gray-200 flex items-center justify-center'>
								<span className='text-gray-400'>160x600 Ad</span>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-8 bg-white p-4 rounded-lg shadow-md'>
					<div className='w-full h-24 bg-gray-200 flex items-center justify-center'>
						<span className='text-gray-400'>728x90 Ad</span>
					</div>
				</div>
			</div>
		</div>
	);
}
