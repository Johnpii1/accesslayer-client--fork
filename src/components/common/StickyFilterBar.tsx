import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetHandle,
	BottomSheetTitle,
	BottomSheetTrigger,
} from '@/components/ui/bottom-sheet';

interface StickyFilterBarProps {
	eyebrow?: string;
	title: string;
	description?: string;
	resultCount?: number;
	children: ReactNode;
	className?: string;
	onReset?: () => void;
	showReset?: boolean;
}

const StickyFilterBar: React.FC<StickyFilterBarProps> = ({
	eyebrow = 'Filters',
	title,
	description,
	resultCount,
	children,
	className,
	onReset,
	showReset,
}) => {
	const [announcedCount, setAnnouncedCount] = useState<number | undefined>(
		resultCount
	);

	// Track whether the viewport is mobile-sized (≤767 px).
	// Using a state-driven matchMedia listener rather than a CSS class so
	// the filter controls are only rendered in ONE place in the DOM at a
	// time, which prevents duplicate element IDs.
	const [isMobile, setIsMobile] = useState<boolean>(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia('(max-width: 767px)').matches;
	});

	// Open state for the mobile filter panel.
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

	// Ref kept on the trigger so Radix can restore focus on close.
	// (Radix Dialog does this automatically via the Trigger element, but
	// keeping the ref lets us imperatively focus it in edge-cases.)
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Debounce result count announcements so screen readers don't stutter
	// on every individual keystroke during a search.
	useEffect(() => {
		const timer = setTimeout(() => {
			setAnnouncedCount(resultCount);
		}, 500);
		return () => clearTimeout(timer);
	}, [resultCount]);

	// Subscribe to viewport changes.
	useEffect(() => {
		const mq = window.matchMedia('(max-width: 767px)');
		const handler = (e: MediaQueryListEvent) => {
			setIsMobile(e.matches);
			// Close the sheet when the user resizes to desktop so it doesn't
			// linger in a half-open state.
			if (!e.matches) setIsFilterPanelOpen(false);
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, []);

	const announcementText =
		typeof announcedCount === 'number'
			? `${announcedCount} ${announcedCount === 1 ? 'result' : 'results'} found.`
			: '';

	const resetButton = showReset && onReset && (
		<Button
			variant="outline"
			size="sm"
			onClick={onReset}
			className="h-8 rounded-full border-amber-500/20 bg-amber-500/5 px-4 text-[0.68rem] font-bold uppercase tracking-wider text-amber-400 transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)] md:h-7 md:px-3"
		>
			<X className="mr-2 size-3 md:mr-1.5" />
			Reset Filters
		</Button>
	);

	return (
		<div className={cn('sticky top-4 z-20 mb-10 md:top-6', className)}>
			<div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/78 px-4 py-4 text-white shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-5 md:py-4">
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_48%,rgba(245,158,11,0.08))]" />

				{/* Hidden live region for search result announcements */}
				<div className="sr-only" aria-live="polite" role="status">
					{announcementText}
				</div>

				<div className="relative flex flex-col gap-4">
					<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
						<div className="min-w-0">
							<p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-amber-300/85">
								{eyebrow}
							</p>
							<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
								<h2 className="font-grotesque text-xl font-bold tracking-tight text-white md:text-2xl">
									{title}
								</h2>
								{typeof resultCount === 'number' && (
									<span
										className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-white/75"
										aria-hidden="true"
									>
										{resultCount}{' '}
										{resultCount === 1 ? 'result' : 'results'}
									</span>
								)}
								{resetButton}
							</div>
							{description && (
								<p className="mt-2 hidden max-w-2xl text-sm text-white/62 md:block">
									{description}
								</p>
							)}
						</div>
					</div>

					{/* ── MOBILE: BottomSheet with built-in focus trap ── */}
					{isMobile ? (
						<BottomSheet
							open={isFilterPanelOpen}
							onOpenChange={setIsFilterPanelOpen}
						>
							<BottomSheetTrigger asChild>
								<Button
									ref={triggerRef}
									variant="outline"
									size="sm"
									data-testid="filter-panel-trigger"
									className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/8 px-5 py-2 text-[0.72rem] font-bold uppercase tracking-wider text-amber-300 transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-500/12 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
									aria-expanded={isFilterPanelOpen}
									aria-controls="filter-panel-content"
								>
									<Filter className="size-3.5" aria-hidden="true" />
									Filters
									{typeof resultCount === 'number' && (
										<span className="ml-1 rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[0.65rem] text-amber-300">
											{resultCount}
										</span>
									)}
								</Button>
							</BottomSheetTrigger>

							<BottomSheetContent
								id="filter-panel-content"
								data-testid="filter-panel-content"
								aria-describedby={undefined}
							>
								<BottomSheetHandle />
								{/* BottomSheetTitle satisfies the Radix Dialog title requirement
								    and is visually hidden so it doesn't crowd the UI. */}
								<BottomSheetTitle className="sr-only">
									{title} Filters
								</BottomSheetTitle>

								<div className="mt-2 flex flex-col gap-4">
									<div className="flex items-center justify-between">
										<p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-amber-300/85">
											{eyebrow}
										</p>
										{resetButton}
									</div>
									{/* Filter controls — focus is trapped here by Radix Dialog */}
									<div className="flex flex-col gap-3">{children}</div>
								</div>
							</BottomSheetContent>
						</BottomSheet>
					) : (
						/* ── DESKTOP: inline controls, no overlay ── */
						<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<div className="w-full md:max-w-2xl">{children}</div>
							<span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-white/45 md:inline-flex">
								Filters stay pinned while you browse
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StickyFilterBar;
