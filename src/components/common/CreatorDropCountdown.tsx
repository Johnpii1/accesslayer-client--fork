import { cn } from '@/lib/utils';
import { useDropCountdown } from '@/hooks/useDropCountdown';

interface CreatorDropCountdownProps {
	nextDropAt: string;
	className?: string;
}

/**
 * Live countdown for a scheduled creator drop; switches to a drop-live label at zero.
 */
const CreatorDropCountdown: React.FC<CreatorDropCountdownProps> = ({
	nextDropAt,
	className,
}) => {
	const { label, isLive } = useDropCountdown(nextDropAt);

	if (label == null) return null;

	return (
		<p
			role="status"
			aria-live="polite"
			className={cn(
				'mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]',
				isLive
					? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
					: 'border-amber-400/25 bg-amber-500/10 text-amber-200/90',
				className
			)}
		>
			<span className="text-white/50">{isLive ? '' : 'Next drop in '}</span>
			<span className="tabular-nums">{label}</span>
		</p>
	);
};

export default CreatorDropCountdown;
