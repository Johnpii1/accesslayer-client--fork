import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatStaleAge } from '@/utils/staleData.utils';

interface StaleDataWarningProps {
	/** Whether the warning should be shown. */
	stale: boolean;
	/**
	 * Milliseconds since the data was fetched — used to surface the
	 * exact "Updated N ago" label when the warning is visible.
	 */
	ageMs?: number;
	/**
	 * Custom copy override. When omitted the warning falls back to the
	 * standard "Stats may be out of date. Refreshing…" wording plus the
	 * formatted age.
	 */
	message?: string;
	className?: string;
}

/**
 * Subtle inline warning shown when creator data is stale (#301).
 *
 * Visual treatment: a small amber pill with an icon, sized so it slots
 * into a stat row without pushing other content around. The component
 * returns `null` when `stale` is false so callers can render it
 * unconditionally.
 *
 * Accessibility: `role="status" aria-live="polite"` so assistive tech
 * announces the warning the moment it appears (and again when it
 * disappears, by way of the surrounding state change). The icon is
 * `aria-hidden` because the textual message already conveys the same
 * meaning.
 */
const StaleDataWarning: React.FC<StaleDataWarningProps> = ({
	stale,
	ageMs,
	message,
	className,
}) => {
	if (!stale) return null;

	const ageLabel =
		ageMs != null && isFinite(ageMs) ? ` · ${formatStaleAge(ageMs)}` : '';
	const copy = message ?? 'Stats may be out of date. Refreshing…';

	return (
		<p
			role="status"
			aria-live="polite"
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[0.7rem] font-medium text-amber-200',
				className
			)}
		>
			<AlertTriangle className="size-3 text-amber-300" aria-hidden="true" />
			<span>
				{copy}
				{ageLabel}
			</span>
		</p>
	);
};

export default StaleDataWarning;
