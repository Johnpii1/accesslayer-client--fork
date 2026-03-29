import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CompactSectionSubtitleProps {
	children: ReactNode;
	className?: string;
}

const CompactSectionSubtitle: React.FC<CompactSectionSubtitleProps> = ({
	children,
	className,
}) => {
	return (
		<p
			className={cn(
				'mt-2 max-w-2xl text-sm leading-6 text-white/62 md:text-[0.95rem]',
				className
			)}
		>
			{children}
		</p>
	);
};

export default CompactSectionSubtitle;
