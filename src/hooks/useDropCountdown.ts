import { useEffect, useMemo, useState } from 'react';
import { getDropCountdownState } from '@/utils/dropCountdown.utils';

/**
 * Tracks time remaining until `targetIso`, updating every second until live.
 */
export function useDropCountdown(targetIso: string | null | undefined) {
	const targetMs = useMemo(() => {
		if (targetIso == null) return null;
		const parsed = new Date(targetIso).getTime();
		return Number.isNaN(parsed) ? null : parsed;
	}, [targetIso]);

	const [nowMs, setNowMs] = useState(() => Date.now());

	useEffect(() => {
		if (targetMs == null) return;
		setNowMs(Date.now());
		const id = window.setInterval(() => setNowMs(Date.now()), 1000);
		return () => window.clearInterval(id);
	}, [targetMs]);

	return useMemo(() => {
		if (targetMs == null) {
			return { isLive: false, label: null as string | null };
		}
		return getDropCountdownState(targetMs, nowMs);
	}, [targetMs, nowMs]);
}
