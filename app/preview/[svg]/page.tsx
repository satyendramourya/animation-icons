'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
		<div className='min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<Link href='/' className='text-blue-600 hover:underline mb-4 inline-block'>
					← Back to Gallery
				</Link>
				<h1 className='text-3xl font-bold mb-8'>{svgName.replace('.svg', '').replace(/-/g, ' ')}</h1>
				<div className='flex flex-col md:flex-row gap-8'>
					<div className='w-full md:w-1/2'>
						<div className='h-64 flex items-center justify-center rounded-lg border border-gray-200'>
							<div
								className=' flex items-center justify-center hover:scale-110 transition-all duration-300'
								dangerouslySetInnerHTML={{ __html: svgContent }}
							/>
						</div>
						<div className='flex space-x-4 mt-4'>
							<button
								onClick={downloadSvg}
								className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
							>
								Download SVG
							</button>
							<button
								onClick={copySvgCode}
								className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors'
							>
								Copy SVG Code
							</button>
						</div>
					</div>
					<div className='w-full md:w-1/2'>
						<h2 className='text-xl font-semibold mb-4'>SVG Code</h2>
						<pre className='p-4 rounded-lg overflow-x-auto text-sm border border-gray-200'>
							<code>{svgContent}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
