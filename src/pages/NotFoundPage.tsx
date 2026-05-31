import { Link } from 'react-router';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NotFoundPage() {
	return (
		<main className="min-h-screen overflow-hidden bg-[#06111f] text-white">
			<section className="relative flex min-h-screen items-center px-6 py-16">
				<div
					className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.2),transparent_30%),linear-gradient(135deg,rgba(6,17,31,0.98),rgba(12,33,58,0.95))]"
					aria-hidden="true"
				/>
				<div
					className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent"
					aria-hidden="true"
				/>

				<div className="relative mx-auto w-full max-w-4xl">
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 font-jakarta text-sm font-bold text-amber-100">
						<Compass className="size-4" aria-hidden="true" />
						Route not found
					</div>

					<p className="font-jakarta text-sm font-black uppercase tracking-[0.28em] text-amber-200/80">
						Access Layer
					</p>
					<h1 className="mt-4 max-w-3xl font-grotesque text-5xl font-black leading-none tracking-tight sm:text-6xl md:text-7xl">
						This marketplace path is not live yet.
					</h1>
					<p className="mt-6 max-w-2xl font-jakarta text-base leading-8 text-white/70 sm:text-lg">
						The creator key route you opened does not exist. Return to the
						marketplace home to browse creators, review key pricing, and keep
						exploring.
					</p>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button
							asChild
							className="h-12 rounded-xl bg-amber-400 px-5 font-jakarta font-black text-slate-950 hover:bg-amber-300"
						>
							<Link to="/">
								<ArrowLeft className="size-4" aria-hidden="true" />
								Back to marketplace
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}

export default NotFoundPage;
