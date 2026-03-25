import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import type { Course } from '@/services/course.service';
import { cn } from '@/lib/utils';
import { ShoppingCart, Wallet, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import showToast from '@/utils/toast.util';

interface CreatorCardProps {
	creator: Course;
	className?: string;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, className }) => {
	const { isConnected } = useAccount();

	const handleBuy = () => {
		if (!isConnected) {
			toast.error('Please connect your wallet to purchase keys', {
				icon: <Wallet className="size-5 text-amber-500" />,
				duration: 4000,
			});
			return;
		}

		showToast.loading(`Purchasing keys for ${creator.title}...`);
		// Implementation for contract interaction would go here
		setTimeout(() => {
			showToast.transactionSuccess(
				'Purchase Successful!',
				`You successfully bought a key for ${creator.title}`
			);
		}, 1500);
	};

	return (
		<div
			className={cn(
				'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-amber-500/30 hover:bg-white/10',
				className
			)}
		>
			<div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
				<img
					src={creator.thumbnail || '/icons/avatar.png'}
					alt={creator.title}
					className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			</div>

			<div className="mb-4">
				<h3 className="font-jakarta text-lg font-bold text-white">
					{creator.title}
				</h3>
				<p className="font-jakarta text-sm text-white/50">
					@{creator.instructorId || 'creator'}
				</p>
				{creator.socialHandle ? (
					<div className="mt-2 flex items-center gap-1.5 text-xs text-white/60">
						<LinkIcon className="size-3 text-amber-500/70" />
						<span className="truncate">@{creator.socialHandle}</span>
					</div>
				) : (
					<div className="mt-2 flex items-center gap-1.5 text-xs text-white/30 italic">
						<LinkIcon className="size-3 opacity-50" />
						<span>No public handle</span>
					</div>
				)}
			</div>

			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-wider text-white/40">
						Key Price
					</p>
					<p className="font-grotesque text-xl font-black text-amber-400">
						{creator.price} ETH
					</p>
				</div>
				<Button
					onClick={handleBuy}
					variant={isConnected ? 'default' : 'outline'}
					size="sm"
					className={cn(
						'rounded-xl font-bold',
						!isConnected &&
							'border-white/10 text-white/60 hover:bg-white/5'
					)}
				>
					<ShoppingCart className="mr-2 size-4" />
					Buy Key
				</Button>
			</div>

			{!isConnected && (
				<div className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-amber-500/70">
					<Wallet className="size-3" />
					Wallet Required
				</div>
			)}
		</div>
	);
};

export default CreatorCard;
