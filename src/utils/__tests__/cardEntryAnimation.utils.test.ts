import { describe, expect, it } from 'vitest';
import {
	creatorCardEntryStyle,
	CREATOR_CARD_ENTRY_CLASS,
} from '../cardEntryAnimation.utils';

describe('creatorCardEntryStyle (#300)', () => {
	it('exports the matching class hook for callers', () => {
		expect(CREATOR_CARD_ENTRY_CLASS).toBe('creator-card-entry');
	});

	it('returns 0ms delay for the first card', () => {
		const style = creatorCardEntryStyle(0, { prefersReducedMotion: false });
		expect(
			(style as Record<string, string>)['--creator-card-entry-delay']
		).toBe('0ms');
	});

	it('staggers subsequent cards by stepMs', () => {
		const s1 = creatorCardEntryStyle(1, {
			stepMs: 50,
			prefersReducedMotion: false,
		});
		const s2 = creatorCardEntryStyle(2, {
			stepMs: 50,
			prefersReducedMotion: false,
		});
		expect((s1 as Record<string, string>)['--creator-card-entry-delay']).toBe(
			'50ms'
		);
		expect((s2 as Record<string, string>)['--creator-card-entry-delay']).toBe(
			'100ms'
		);
	});

	it('caps the delay at maxDelayMs so the last card does not lag', () => {
		const style = creatorCardEntryStyle(50, {
			stepMs: 40,
			maxDelayMs: 200,
			prefersReducedMotion: false,
		});
		expect(
			(style as Record<string, string>)['--creator-card-entry-delay']
		).toBe('200ms');
	});

	it('returns 0ms delay when prefers-reduced-motion is set', () => {
		const style = creatorCardEntryStyle(5, { prefersReducedMotion: true });
		expect(
			(style as Record<string, string>)['--creator-card-entry-delay']
		).toBe('0ms');
	});

	it('returns 0ms delay when explicitly disabled', () => {
		const style = creatorCardEntryStyle(5, {
			disabled: true,
			prefersReducedMotion: false,
		});
		expect(
			(style as Record<string, string>)['--creator-card-entry-delay']
		).toBe('0ms');
	});

	it('treats negative indices as a no-op', () => {
		const style = creatorCardEntryStyle(-1, { prefersReducedMotion: false });
		expect(
			(style as Record<string, string>)['--creator-card-entry-delay']
		).toBe('0ms');
	});
});
