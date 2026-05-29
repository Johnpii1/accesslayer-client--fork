import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Subscribes to the user's reduced-motion preference.
 */
export function usePrefersReducedMotion(): boolean {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia(QUERY).matches;
	});

	useEffect(() => {
		const media = window.matchMedia(QUERY);
		const onChange = () => setPrefersReducedMotion(media.matches);
		onChange();
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	}, []);

	return prefersReducedMotion;
}
