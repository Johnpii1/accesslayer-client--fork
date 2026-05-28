import { describe, expect, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import StickyFilterBar from '@/components/common/StickyFilterBar';

describe('StickyFilterBar accessibility', () => {
	it('renders a visually hidden aria-live region for search results', () => {
		render(
			<StickyFilterBar title="Test Bar" resultCount={5}>
				<div>Children</div>
			</StickyFilterBar>
		);

		const liveRegion = screen.getByRole('status');
		expect(liveRegion).toHaveAttribute('aria-live', 'polite');
		expect(liveRegion).toHaveClass('sr-only');
	});

	it('debounces the aria-live announcement of result count', async () => {
		vi.useFakeTimers();
		const { rerender } = render(
			<StickyFilterBar title="Test Bar" resultCount={5}>
				<div>Children</div>
			</StickyFilterBar>
		);

		// Initial render should have the count (or undefined if it's the very first render before effect)
		// Actually in my implementation, announcedCount is initialized with resultCount
		expect(screen.getByRole('status')).toHaveTextContent('5 results found.');

		// Change count
		rerender(
			<StickyFilterBar title="Test Bar" resultCount={10}>
				<div>Children</div>
			</StickyFilterBar>
		);

		// Should still show old count immediately
		expect(screen.getByRole('status')).toHaveTextContent('5 results found.');

		// Fast forward time
		act(() => {
			vi.advanceTimersByTime(500);
		});

		// Should show new count
		expect(screen.getByRole('status')).toHaveTextContent('10 results found.');

		vi.useRealTimers();
	});

	it('hides the visual count from screen readers to avoid double-announcement', () => {
		render(
			<StickyFilterBar title="Test Bar" resultCount={5}>
				<div>Children</div>
			</StickyFilterBar>
		);

		// The visual count span should have aria-hidden="true"
		const visualCount = screen.getByText('5 results');
		expect(visualCount).toHaveAttribute('aria-hidden', 'true');
	});
});
