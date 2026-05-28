import { useEffect, useMemo, useState } from 'react';
import {
	DEFAULT_STALE_THRESHOLD_MS,
	isStale,
	type StaleDataResult,
} from '@/utils/staleData.utils';

export interface UseStaleDataOptions {
	/** Override the default 60s freshness window. */
	thresholdMs?: number;
	/**
	 * Called when the data first crosses the staleness boundary.
	 * Production callers wire this to a background refresh; tests pass
	 * a spy.
	 */
	onStale?: () => void;
	/**
	 * If `true` (the default), schedule a `setTimeout` to re-evaluate
	 * staleness exactly when the threshold expires so the warning shows
	 * without waiting for an external re-render.
	 */
	autoEvaluate?: boolean;
}

export interface UseStaleDataReturn extends StaleDataResult {
	/** Force-recompute now (useful right after a refetch resolves). */
	revalidate: () => void;
}

/**
 * Track whether the caller-supplied `lastFetchedAt` is past the staleness
 * threshold (#301). When the timestamp crosses the boundary, the hook
 * fires `onStale` exactly once until `lastFetchedAt` changes — so wiring
 * it to a `refetch` callback drives a background refresh without
 * thrashing.
 */
export const useStaleData = (
	lastFetchedAt: number | null | undefined,
	options: UseStaleDataOptions = {}
): UseStaleDataReturn => {
	const {
		thresholdMs = DEFAULT_STALE_THRESHOLD_MS,
		onStale,
		autoEvaluate = true,
	} = options;

	const [tick, setTick] = useState(0);

	const result = useMemo(
		() => isStale(lastFetchedAt, thresholdMs),
		// `tick` is intentionally part of the dep array so a `setTick`
		// re-evaluates the result without changing `lastFetchedAt`.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[lastFetchedAt, thresholdMs, tick]
	);

	// Drive `onStale` exactly once per (lastFetchedAt, stale-transition)
	// pair. When the data becomes fresh again the latch resets so the next
	// stale transition fires once more — a flow that re-fetches and goes
	// stale repeatedly will see one fire per stale transition, not one
	// fire ever.
	const [hasFiredForCurrentEpoch, setHasFiredForCurrentEpoch] =
		useState(false);
	useEffect(() => {
		if (!result.stale) {
			// Becoming fresh resets the latch so the next stale transition
			// can fire `onStale` again.
			if (hasFiredForCurrentEpoch) {
				setHasFiredForCurrentEpoch(false);
			}
			return;
		}
		if (hasFiredForCurrentEpoch) return;
		onStale?.();
		setHasFiredForCurrentEpoch(true);
		// `hasFiredForCurrentEpoch` is intentionally checked but not
		// listed: we never want a state change *here* to re-trigger the
		// effect — only the `stale` transition does.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [result.stale, lastFetchedAt]);

	// Schedule a re-check at the precise moment the data goes stale.
	useEffect(() => {
		if (!autoEvaluate || result.stale || result.msUntilStale <= 0) return;
		const id = window.setTimeout(
			() => setTick(t => t + 1),
			result.msUntilStale
		);
		return () => window.clearTimeout(id);
	}, [autoEvaluate, result.stale, result.msUntilStale]);

	const revalidate = () => setTick(t => t + 1);

	return { ...result, revalidate };
};
