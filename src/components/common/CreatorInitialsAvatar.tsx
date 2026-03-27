import { cn } from '@/lib/utils';

interface CreatorInitialsAvatarProps {
	name: string;
	imageSrc?: string;
	className?: string;
	imageClassName?: string;
}

const getInitials = (name: string) => {
	const cleanName = name.trim();
	if (!cleanName) {
		return 'NA';
	}

	const parts = cleanName.split(/\s+/).filter(Boolean);
	if (parts.length === 1) {
		return parts[0].slice(0, 2).toUpperCase();
	}

	return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
};

const CreatorInitialsAvatar: React.FC<CreatorInitialsAvatarProps> = ({
	name,
	imageSrc,
	className,
	imageClassName,
}) => {
	const initials = getInitials(name);

	if (!imageSrc) {
		return (
			<div
				className={cn(
					'flex size-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-amber-700 text-3xl font-black tracking-wide text-white/95',
					className
				)}
			>
				<span aria-label={`${name} initials avatar`}>{initials}</span>
			</div>
		);
	}

	return (
		<img
			src={imageSrc}
			alt={name}
			className={cn('size-full object-cover', imageClassName, className)}
		/>
	);
};

export default CreatorInitialsAvatar;
