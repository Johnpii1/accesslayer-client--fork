import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConnectWalletButton from '@/components/common/ConnectWalletButton';

interface WalletConnectCalloutBannerProps {
	title?: string;
	description?: string;
	className?: string;
}

const WalletConnectCalloutBanner: React.FC<WalletConnectCalloutBannerProps> = ({
	title = 'Wallet connection required',
	description = 'Connect your wallet to continue with creator key purchases and on-chain actions.',
	className,
}) => {
	return (
		<div
			className={cn(
				'rounded-2xl border border-amber-300/30 bg-gradient-to-r from-amber-400/10 via-amber-200/5 to-emerald-300/10 p-4',
				className
			)}
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="min-w-0">
					<div className="mb-1 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/85">
						<Wallet className="size-3.5" />
						Wallet required
					</div>
					<p className="font-jakarta text-sm font-bold text-amber-100">
						{title}
					</p>
					<p className="mt-1 text-xs text-amber-100/75">{description}</p>
				</div>
				<div className="shrink-0">
					<ConnectWalletButton />
				</div>
			</div>
		</div>
	);
};

export default WalletConnectCalloutBanner;
