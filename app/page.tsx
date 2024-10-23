'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const particles: Particle[] = [];
		const particleCount = 100;

		class Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			color: string;

			constructor() {
				this.x = Math.random() * canvas!.width;
				this.y = Math.random() * canvas!.height;
				this.size = Math.random() * 3 + 1;
				this.speedX = Math.random() * 3 - 1.5;
				this.speedY = Math.random() * 3 - 1.5;
				this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				// if (this.size > 0.2) this.size -= 0.02;

				if (canvas) {
					if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
					if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
				}
			}

			draw() {
				if (!ctx) return;
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		function init() {
			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}
		}

		function animate() {
			if (!ctx || !canvas) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (let i = 0; i < particles.length; i++) {
				particles[i].update();
				particles[i].draw();
			}
			requestAnimationFrame(animate);
		}

		init();
		animate();

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<main className='min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white'>
			<canvas ref={canvasRef} className='absolute inset-0 z-0' />
			<div className='z-10 text-center space-y-8'>
				<h1 className='text-5xl font-bold mb-10 animate-fade-in'>Animated SVG </h1>

				<Link
					href='/animations'
					className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 animate-fade-in animation-delay-600'
				>
					Explore SVGs
				</Link>
			</div>
		</main>
	);
}
