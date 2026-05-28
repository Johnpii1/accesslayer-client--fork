import { useEffect, useRef } from 'react';

interface UseScrollPreservationOptions {
	/**
	 * Storage key prefix for saving scroll positions
	 */
	storageKey: string;
	/**
	 * Whether to enable scroll preservation
	 */
	enabled?: boolean;
	/**
	 * Delay in milliseconds before restoring scroll position
	 */
	restoreDelay?: number;
}

/**
 * Hook for preserving scroll position when switching between tabs or states
 */
export function useScrollPreservation(
	currentTab: string,
	options: UseScrollPreservationOptions
) {
	const { storageKey, enabled = true, restoreDelay = 0 } = options;
	const previousTabRef = useRef<string | null>(null);
	const restoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!enabled || typeof window === 'undefined') return;

		const fullStorageKey = `${storageKey}.${currentTab}`;

		// Save scroll position for the previous tab
		if (previousTabRef.current && previousTabRef.current !== currentTab) {
			const previousKey = `${storageKey}.${previousTabRef.current}`;
			window.sessionStorage.setItem(previousKey, String(window.scrollY));
		}

		// Restore scroll position for the current tab
		const savedScroll = window.sessionStorage.getItem(fullStorageKey);
		if (savedScroll) {
			const scrollY = Number(savedScroll);
			if (Number.isFinite(scrollY)) {
				// Clear any pending restore timeout
				if (restoreTimeoutRef.current) {
					clearTimeout(restoreTimeoutRef.current);
				}

				// Restore scroll position with optional delay
				if (restoreDelay > 0) {
					restoreTimeoutRef.current = setTimeout(() => {
						window.scrollTo({ top: scrollY, behavior: 'instant' });
					}, restoreDelay);
				} else {
					// Use requestAnimationFrame to ensure DOM is ready
					requestAnimationFrame(() => {
						window.scrollTo({ top: scrollY, behavior: 'instant' });
					});
				}
			}
		}

		// Update the previous tab reference
		previousTabRef.current = currentTab;

		// Cleanup timeout on unmount
		return () => {
			if (restoreTimeoutRef.current) {
				clearTimeout(restoreTimeoutRef.current);
			}
		};
	}, [currentTab, storageKey, enabled, restoreDelay]);

	// Save scroll position on scroll events
	useEffect(() => {
		if (!enabled || typeof window === 'undefined') return;

		const handleScroll = () => {
			const fullStorageKey = `${storageKey}.${currentTab}`;
			window.sessionStorage.setItem(fullStorageKey, String(window.scrollY));
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [currentTab, storageKey, enabled]);
}