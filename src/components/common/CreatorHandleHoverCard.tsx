import type { ReactNode } from 'react';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import { formatCompactNumber, formatPercent } from '@/utils/numberFormat.utils';
import { cn } from '@/lib/utils';

interface CreatorHandleHoverCardProps {
	handle: string;
	volume24h?: number;
	change24h?: number;
	creatorShareSupply?: number;
	isVerified?: boolean;
	children: ReactNode;
	className?: string;
}

const CreatorHandleHoverCard: React.FC<CreatorHandleHoverCardProps> = ({
	handle,
	volume24h,
	change24h,
	creatorShareSupply,
	isVerified,
	children,
	className,
}) => {
	const hasStats =
		volume24h !== undefined ||
		change24h !== undefined ||
		creatorShareSupply !== undefined;

	return (
		<HoverCard openDelay={300} closeDelay={150}>
			<HoverCardTrigger asChild>
				<span
					className={cn(
						'cursor-pointer border-b border-dotted border-white/20 transition-colors hover:border-amber-400/50',
						className
					)}
				>
					{children}
				</span>
			</HoverCardTrigger>
			<HoverCardContent
				side="top"
				align="center"
				className="w-56 border-white/10 bg-slate-900/95 backdrop-blur-xl"
			>
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<span className="font-jakarta text-sm font-semibold text-white">
							{handle}
						</span>
						{isVerified && <VerifiedBadge verified className="shrink-0" />}
					</div>

					{hasStats && (
						<div className="grid grid-cols-2 gap-2">
							{volume24h !== undefined && (
								<div className="rounded-lg bg-white/[0.06] px-2.5 py-1.5">
									<p className="text-[10px] uppercase tracking-[0.12em] text-white/42">
										Volume 24h
									</p>
									<p className="font-jakarta text-sm font-semibold text-white">
										{formatCompactNumber(volume24h)} ETH
									</p>
								</div>
							)}
							{change24h !== undefined && (
								<div className="rounded-lg bg-white/[0.06] px-2.5 py-1.5">
									<p className="text-[10px] uppercase tracking-[0.12em] text-white/42">
										24h Change
									</p>
									<p
										className={cn(
											'font-jakarta text-sm font-semibold',
											change24h > 0 && 'text-emerald-400',
											change24h < 0 && 'text-red-400',
											change24h === 0 && 'text-white'
										)}
									>
										{formatPercent(change24h, { signed: true })}
									</p>
								</div>
							)}
							{creatorShareSupply !== undefined && (
								<div className="rounded-lg bg-white/[0.06] px-2.5 py-1.5">
									<p className="text-[10px] uppercase tracking-[0.12em] text-white/42">
										Supply
									</p>
									<p className="font-jakarta text-sm font-semibold text-white">
										{formatCompactNumber(creatorShareSupply)}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default CreatorHandleHoverCard;
