/**
 * Formats milliseconds remaining until a drop as a compact human-readable string.
 */
export function formatDropTimeRemaining(msRemaining: number): string {
	const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
	const days = Math.floor(totalSeconds / 86_400);
	const hours = Math.floor((totalSeconds % 86_400) / 3_600);
	const minutes = Math.floor((totalSeconds % 3_600) / 60);
	const seconds = totalSeconds % 60;

	const parts: string[] = [];
	if (days > 0) parts.push(`${days}d`);
	if (days > 0 || hours > 0) parts.push(`${hours}h`);
	if (days > 0 || hours > 0 || minutes > 0) parts.push(`${minutes}m`);
	parts.push(`${seconds}s`);

	return parts.join(' ');
}

export function getDropCountdownState(
	targetMs: number,
	nowMs: number
): { isLive: boolean; label: string } {
	const remaining = targetMs - nowMs;
	if (remaining <= 0) {
		return { isLive: true, label: 'Drop live' };
	}
	return {
		isLive: false,
		label: formatDropTimeRemaining(remaining),
	};
}
