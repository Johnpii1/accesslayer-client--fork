import { cn } from '@/lib/utils';

interface MiniStatChipProps {
	label: string;
	value: string;
	className?: string;
}

const MiniStatChip: React.FC<MiniStatChipProps> = ({
	label,
	value,
	className,
}) => {
	return (
		<div
			className={cn(
				'inline-flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[0.65rem] font-medium text-white/80 backdrop-blur-sm',
				className
			)}
		>
			<span className="shrink-0 uppercase tracking-[0.18em] text-white/42">
				{label}
			</span>
			<span className="truncate font-jakarta text-xs font-semibold text-white">
				{value}
			</span>
		</div>
	);
};

export default MiniStatChip;
