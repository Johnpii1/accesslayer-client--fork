/**
 * Staggered card-entry animation helper for the creator marketplace list
 * view (#300).
 *
 * Returns inline CSS variables and class hooks so a card at position
 * `index` animates in with a small offset relative to the card before it.
 * The animation is intentionally short (under 200ms) so the cards remain
 * interactive almost immediately — pointer events stay enabled the whole
 * time.
 *
 * Reduced-motion: when the user has `prefers-reduced-motion: reduce`
 * active, the helper short-circuits and returns the no-op style (no
 * `animation` property, no offset). Callers can also bypass with the
 * `disabled` option.
 */

export interface CreatorCardEntryStyleOptions {
	/** Stagger between consecutive cards in ms (default `40`). */
	stepMs?: number;
	/** Cap the stagger so the last card doesn't feel sluggish (default `360`). */
	maxDelayMs?: number;
	/** Skip the animation entirely (e.g. for tests). */
	disabled?: boolean;
	/**
	 * Override the prefers-reduced-motion check. Tests pass `false` to
	 * exercise the animation branch deterministically; production callers
	 * leave it undefined.
	 */
	prefersReducedMotion?: boolean;
}

/**
 * Returns a `style` object suitable for spreading onto the card root
 * element. Pair with the `.creator-card-entry` CSS class (declared in
 * the global stylesheet) which reads the `--creator-card-entry-delay`
 * variable.
 */
export const creatorCardEntryStyle = (
	index: number,
	options: CreatorCardEntryStyleOptions = {}
): React.CSSProperties => {
	const {
		stepMs = 40,
		maxDelayMs = 360,
		disabled = false,
		prefersReducedMotion,
	} = options;

	const reducedMotion =
		prefersReducedMotion ??
		(typeof window !== 'undefined' &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches);

	if (disabled || reducedMotion || index < 0) {
		// No animation: the variable is still set so the CSS rule can
		// branch on it safely.
		return { ['--creator-card-entry-delay' as never]: '0ms' };
	}

	const delay = Math.min(index * stepMs, maxDelayMs);
	return { ['--creator-card-entry-delay' as never]: `${delay}ms` };
};

/**
 * Class name the cards opt into. Co-located with the helper so callers
 * don't have to remember it separately.
 */
export const CREATOR_CARD_ENTRY_CLASS = 'creator-card-entry';
