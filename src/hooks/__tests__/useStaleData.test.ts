import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useStaleData } from '@/hooks/useStaleData';

describe('useStaleData', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-05-28T00:00:00Z'));
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('reports the data as fresh when lastFetchedAt is within the window', () => {
		const now = Date.now();
		const { result } = renderHook(() =>
			useStaleData(now - 10_000, { thresholdMs: 60_000, autoEvaluate: false })
		);
		expect(result.current.stale).toBe(false);
		expect(result.current.ageMs).toBe(10_000);
	});

	it('reports the data as stale once the timestamp crosses the threshold', () => {
		const now = Date.now();
		const { result } = renderHook(() =>
			useStaleData(now - 60_000, { thresholdMs: 60_000, autoEvaluate: false })
		);
		expect(result.current.stale).toBe(true);
	});

	it('fires onStale exactly once per lastFetchedAt epoch', () => {
		const onStale = vi.fn();
		const now = Date.now();

		const { rerender } = renderHook(
			({ ts }) =>
				useStaleData(ts, {
					thresholdMs: 60_000,
					autoEvaluate: false,
					onStale,
				}),
			{ initialProps: { ts: now - 90_000 } }
		);

		// Stale from the get-go → fires once.
		expect(onStale).toHaveBeenCalledTimes(1);

		// Re-render with the SAME timestamp: must not fire again.
		rerender({ ts: now - 90_000 });
		expect(onStale).toHaveBeenCalledTimes(1);

		// New fetch baseline (fresh again) → no additional fire.
		rerender({ ts: now });
		expect(onStale).toHaveBeenCalledTimes(1);

		// And when THAT new epoch goes stale, we fire one more time.
		rerender({ ts: now - 90_000 });
		expect(onStale).toHaveBeenCalledTimes(2);
	});

	it('does not fire onStale when the data is fresh', () => {
		const onStale = vi.fn();
		renderHook(() =>
			useStaleData(Date.now() - 5_000, {
				thresholdMs: 60_000,
				autoEvaluate: false,
				onStale,
			})
		);
		expect(onStale).not.toHaveBeenCalled();
	});

	it('auto-evaluates exactly at the staleness boundary', () => {
		const onStale = vi.fn();
		const ts = Date.now() - 10_000; // 50s of headroom on a 60s window
		const { result } = renderHook(() =>
			useStaleData(ts, { thresholdMs: 60_000, onStale })
		);
		expect(result.current.stale).toBe(false);

		act(() => {
			vi.advanceTimersByTime(50_000);
		});
		expect(result.current.stale).toBe(true);
		expect(onStale).toHaveBeenCalledTimes(1);
	});

	it('treats a null/undefined timestamp as stale', () => {
		const onStale = vi.fn();
		const { result } = renderHook(() =>
			useStaleData(null, {
				thresholdMs: 60_000,
				autoEvaluate: false,
				onStale,
			})
		);
		expect(result.current.stale).toBe(true);
		expect(onStale).toHaveBeenCalledTimes(1);
	});

	it('exposes a revalidate() escape hatch that re-evaluates without changing inputs', () => {
		const ts = Date.now() - 30_000;
		const { result } = renderHook(() =>
			useStaleData(ts, { thresholdMs: 60_000, autoEvaluate: false })
		);
		expect(result.current.stale).toBe(false);

		// Advance the wall clock without auto-eval scheduling, then revalidate.
		vi.setSystemTime(new Date(Date.now() + 60_000));
		act(() => {
			result.current.revalidate();
		});
		expect(result.current.stale).toBe(true);
	});
});
