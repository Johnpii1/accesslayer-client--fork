import { describe, expect, it } from 'vitest';
import {
	formatDropTimeRemaining,
	getDropCountdownState,
} from '../dropCountdown.utils';

describe('formatDropTimeRemaining', () => {
	it('includes days, hours, minutes, and seconds when relevant', () => {
		const ms =
			2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000;
		expect(formatDropTimeRemaining(ms)).toBe('2d 3h 4m 5s');
	});
});

describe('getDropCountdownState', () => {
	it('returns drop-live when the target time has passed', () => {
		expect(getDropCountdownState(1_000, 2_000)).toEqual({
			isLive: true,
			label: 'Drop live',
		});
	});

	it('returns a countdown label while time remains', () => {
		const state = getDropCountdownState(65_000, 0);
		expect(state.isLive).toBe(false);
		expect(state.label).toBe('1m 5s');
	});
});
