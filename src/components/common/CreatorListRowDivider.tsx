import { cn } from '@/lib/utils';

interface CreatorListRowDividerProps {
	className?: string;
}

const CreatorListRowDivider: React.FC<CreatorListRowDividerProps> = ({
	className,
}) => {
	return (
		<div
			className={cn(
				'h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent',
				className
			)}
			aria-hidden="true"
		/>
	);
};

export default CreatorListRowDivider;
