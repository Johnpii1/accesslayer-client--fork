import { describe, expect, it } from 'vitest';
import { formatCreatorHandle } from '../handleDisplay.utils';

describe('formatCreatorHandle', () => {
	it('lowercases mixed-case handles and prepends @', () => {
		expect(formatCreatorHandle('ARivers')).toBe('@arivers');
		expect(formatCreatorHandle('Schen_Dev')).toBe('@schen_dev');
	});

	it('strips an existing leading @ before re-prepending', () => {
		expect(formatCreatorHandle('@ARivers')).toBe('@arivers');
		expect(formatCreatorHandle('@@nope')).toBe('@@nope'); // only one @ stripped
	});

	it('trims surrounding whitespace', () => {
		expect(formatCreatorHandle('  ARivers  ')).toBe('@arivers');
		expect(formatCreatorHandle('  @ARivers  ')).toBe('@arivers');
	});

	it('returns an empty string for empty / whitespace / nullish input', () => {
		expect(formatCreatorHandle('')).toBe('');
		expect(formatCreatorHandle('   ')).toBe('');
		expect(formatCreatorHandle(null)).toBe('');
		expect(formatCreatorHandle(undefined)).toBe('');
	});

	it('returns an empty string when the input is just an @', () => {
		// A lone @ implies the user forgot to type their handle — no point
		// rendering "@" alone on a card, callers can fall back to a placeholder.
		expect(formatCreatorHandle('@')).toBe('');
		expect(formatCreatorHandle('@   ')).toBe('');
	});

	it('is idempotent: formatting an already-formatted handle is a no-op', () => {
		expect(formatCreatorHandle(formatCreatorHandle('ARivers'))).toBe('@arivers');
	});

	it('does not modify the underlying string the caller passes in', () => {
		// (Strings are immutable in JS, so this is really about not having
		// side effects on, e.g., trimming the original via mutation — but the
		// invariant matters: callers must keep the raw value for equality.)
		const raw = 'ARivers';
		formatCreatorHandle(raw);
		expect(raw).toBe('ARivers');
	});
});
