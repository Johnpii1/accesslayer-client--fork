/** Spring transition for marketplace creator card reorder (#355). */
export const CREATOR_LIST_SORT_LAYOUT_TRANSITION = {
	type: 'spring' as const,
	stiffness: 520,
	damping: 42,
	mass: 0.85,
};
