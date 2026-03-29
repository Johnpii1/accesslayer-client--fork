import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TransactionStatus = 'success' | 'pending' | 'failed';

interface TransactionStatusIconProps {
	status: TransactionStatus;
	className?: string;
}

const statusStyles: Record<TransactionStatus, string> = {
	success: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-300/35',
	pending: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-300/35',
	failed: 'bg-red-500/15 text-red-300 ring-1 ring-red-300/35',
};

const TransactionStatusIcon: React.FC<TransactionStatusIconProps> = ({
	status,
	className,
}) => {
	if (status === 'success') {
		return (
			<span
				aria-label="Transaction success"
				className={cn(
					'inline-flex rounded-full p-1.5',
					statusStyles.success,
					className
				)}
			>
				<CheckCircle2 className="size-4" />
			</span>
		);
	}

	if (status === 'pending') {
		return (
			<span
				aria-label="Transaction pending"
				className={cn(
					'inline-flex rounded-full p-1.5',
					statusStyles.pending,
					className
				)}
			>
				<Clock3 className="size-4 animate-pulse" />
			</span>
		);
	}

	return (
		<span
			aria-label="Transaction failed"
			className={cn(
				'inline-flex rounded-full p-1.5',
				statusStyles.failed,
				className
			)}
		>
			<XCircle className="size-4" />
		</span>
	);
};

export default TransactionStatusIcon;
