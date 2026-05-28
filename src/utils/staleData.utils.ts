/**
 * Stale-data detection helper (#301).
 *
 * Compares a fetched-at timestamp against a configurable freshness
 * window. Used by the inline stale-data warning to decide when to nudge
 * the user that the creator stats / prices they're looking at may not
 * reflect the latest on-chain state.
 *
 * The helper is intentionally side-effect-free: it just returns a small
 * structured result. The hook (`useStaleData`) layers the periodic
 * re-check + background-refresh trigger on top.
 */

export interface StaleDataResult {
	/** `true` when `lastFetchedAt` is older than the threshold. */
	stale: boolean;
	/** Milliseconds the data has been around since fetch. */
	ageMs: number;
	/** Time until the data becomes stale (0 when already stale). */
	msUntilStale: number;
}

export interface IsStaleOptions {
	/**
	 * The reference "now" for the comparison. Defaults to `Date.now()`;
	 * tests pass a fixed value for determinism.
	 */
	now?: number;
}

/** Default freshness window: 60 seconds. */
export const DEFAULT_STALE_THRESHOLD_MS = 60_000;

/**
 * Compute whether `lastFetchedAt` is past the freshness window.
 *
 * Edge cases:
 *  - `lastFetchedAt == null` → treated as stale (we have no idea when it
 *    was fetched, so prompt a refresh).
 *  - `lastFetchedAt > now` (clock skew) → treated as fresh; the data is
 *    obviously not older than "now".
 *  - `thresholdMs <= 0` → always stale (callers can pass this to force
 *    a permanent warning when something is known-broken).
 */
export const isStale = (
	lastFetchedAt: number | null | undefined,
	thresholdMs: number = DEFAULT_STALE_THRESHOLD_MS,
	options: IsStaleOptions = {}
): StaleDataResult => {
	const now = options.now ?? Date.now();

	if (lastFetchedAt == null) {
		return { stale: true, ageMs: Number.POSITIVE_INFINITY, msUntilStale: 0 };
	}

	const ageMs = Math.max(0, now - lastFetchedAt);
	if (thresholdMs <= 0) {
		return { stale: true, ageMs, msUntilStale: 0 };
	}

	const stale = ageMs >= thresholdMs;
	const msUntilStale = stale ? 0 : Math.max(0, thresholdMs - ageMs);
	return { stale, ageMs, msUntilStale };
};

/**
 * Format a human-readable "Updated N ago" string for the warning copy.
 * Returns a short label that the inline warning can substitute directly.
 */
export const formatStaleAge = (ageMs: number): string => {
	if (!isFinite(ageMs) || ageMs < 0) return 'Last update unknown';
	const seconds = Math.floor(ageMs / 1000);
	if (seconds < 5) return 'Just updated';
	if (seconds < 60) return `Updated ${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `Updated ${minutes} min ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `Updated ${hours} hr ago`;
	const days = Math.floor(hours / 24);
	return `Updated ${days} day${days === 1 ? '' : 's'} ago`;
};
