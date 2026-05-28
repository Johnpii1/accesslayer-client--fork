import { describe, expect, it } from 'vitest';
import {
	DEFAULT_STALE_THRESHOLD_MS,
	formatStaleAge,
	isStale,
} from '../staleData.utils';

const FROZEN_NOW = 1_700_000_000_000;

describe('isStale (#301)', () => {
	it('treats nullish timestamps as stale with infinite age', () => {
		const a = isStale(null, 60_000, { now: FROZEN_NOW });
		expect(a.stale).toBe(true);
		expect(a.ageMs).toBe(Number.POSITIVE_INFINITY);
		expect(a.msUntilStale).toBe(0);
		const b = isStale(undefined, 60_000, { now: FROZEN_NOW });
		expect(b.stale).toBe(true);
	});

	it('returns stale=false when the data is within the threshold', () => {
		const result = isStale(FROZEN_NOW - 30_000, 60_000, { now: FROZEN_NOW });
		expect(result.stale).toBe(false);
		expect(result.ageMs).toBe(30_000);
		expect(result.msUntilStale).toBe(30_000);
	});

	it('returns stale=true exactly at the threshold boundary', () => {
		const result = isStale(FROZEN_NOW - 60_000, 60_000, { now: FROZEN_NOW });
		expect(result.stale).toBe(true);
		expect(result.msUntilStale).toBe(0);
	});

	it('clamps negative ages from clock skew to zero', () => {
		const result = isStale(FROZEN_NOW + 5_000, 60_000, { now: FROZEN_NOW });
		expect(result.ageMs).toBe(0);
		expect(result.stale).toBe(false);
	});

	it('always reports stale when thresholdMs is non-positive', () => {
		const result = isStale(FROZEN_NOW - 1, 0, { now: FROZEN_NOW });
		expect(result.stale).toBe(true);
	});

	it('uses the default threshold of 60 seconds', () => {
		const fresh = isStale(FROZEN_NOW - (DEFAULT_STALE_THRESHOLD_MS - 1), undefined, {
			now: FROZEN_NOW,
		});
		expect(fresh.stale).toBe(false);
		const stale = isStale(FROZEN_NOW - DEFAULT_STALE_THRESHOLD_MS, undefined, {
			now: FROZEN_NOW,
		});
		expect(stale.stale).toBe(true);
	});
});

describe('formatStaleAge', () => {
	it('returns "Just updated" for very small ages', () => {
		expect(formatStaleAge(1_000)).toBe('Just updated');
		expect(formatStaleAge(0)).toBe('Just updated');
	});

	it('formats seconds, minutes, hours, days as expected', () => {
		expect(formatStaleAge(30_000)).toBe('Updated 30s ago');
		expect(formatStaleAge(180_000)).toBe('Updated 3 min ago');
		expect(formatStaleAge(2 * 60 * 60 * 1000)).toBe('Updated 2 hr ago');
		expect(formatStaleAge(2 * 24 * 60 * 60 * 1000)).toBe('Updated 2 days ago');
		expect(formatStaleAge(24 * 60 * 60 * 1000)).toBe('Updated 1 day ago');
	});

	it('returns a sensible fallback for non-finite / negative inputs', () => {
		expect(formatStaleAge(Number.POSITIVE_INFINITY)).toBe(
			'Last update unknown'
		);
		expect(formatStaleAge(-1)).toBe('Last update unknown');
	});
});
