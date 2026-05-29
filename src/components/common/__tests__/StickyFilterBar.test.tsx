import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import StickyFilterBar from '@/components/common/StickyFilterBar';

// ---------------------------------------------------------------------------
// matchMedia mock helpers
// ---------------------------------------------------------------------------

type MQCallback = (e: Pick<MediaQueryListEvent, 'matches'>) => void;

interface MockMQL {
	matches: boolean;
	addEventListener: (event: string, cb: MQCallback) => void;
	removeEventListener: (event: string, cb: MQCallback) => void;
	_fire: (newMatches: boolean) => void;
}

function mockMatchMedia(matches: boolean): MockMQL {
	const listeners: MQCallback[] = [];
	const mql: MockMQL = {
		matches,
		addEventListener: (_event: string, cb: MQCallback) =>
			listeners.push(cb),
		removeEventListener: (_event: string, cb: MQCallback) => {
			const idx = listeners.indexOf(cb);
			if (idx !== -1) listeners.splice(idx, 1);
		},
		_fire: (newMatches: boolean) =>
			listeners.forEach((cb) => cb({ matches: newMatches })),
	};
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockReturnValue(mql),
	});
	return mql;
}

// ---------------------------------------------------------------------------
// Existing accessibility tests (unchanged behaviour)
// ---------------------------------------------------------------------------

describe('StickyFilterBar accessibility', () => {
	beforeEach(() => {
		mockMatchMedia(false); // desktop by default
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

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

		expect(screen.getByRole('status')).toHaveTextContent('5 results found.');

		rerender(
			<StickyFilterBar title="Test Bar" resultCount={10}>
				<div>Children</div>
			</StickyFilterBar>
		);

		// Should still show old count immediately
		expect(screen.getByRole('status')).toHaveTextContent('5 results found.');

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(screen.getByRole('status')).toHaveTextContent('10 results found.');

		vi.useRealTimers();
	});

	it('hides the visual count from screen readers to avoid double-announcement', () => {
		render(
			<StickyFilterBar title="Test Bar" resultCount={5}>
				<div>Children</div>
			</StickyFilterBar>
		);

		const visualCount = screen.getByText('5 results');
		expect(visualCount).toHaveAttribute('aria-hidden', 'true');
	});
});

// ---------------------------------------------------------------------------
// Focus-trap / BottomSheet tests — mobile viewport
// ---------------------------------------------------------------------------

describe('StickyFilterBar – mobile focus trap', () => {
	beforeEach(() => {
		mockMatchMedia(true); // simulate mobile (max-width: 767px)
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders a trigger button instead of inline controls on mobile', () => {
		render(
			<StickyFilterBar title="Test Bar">
				<input data-testid="filter-input" placeholder="search" />
			</StickyFilterBar>
		);

		// Trigger must exist
		expect(screen.getByTestId('filter-panel-trigger')).toBeInTheDocument();

		// Inline filter input must NOT be visible — it lives inside the sheet
		// which is closed, so Radix won't mount it yet.
		expect(screen.queryByTestId('filter-input')).not.toBeInTheDocument();
	});

	it('trigger button has aria-expanded="false" when panel is closed', () => {
		render(
			<StickyFilterBar title="Test Bar">
				<div>Controls</div>
			</StickyFilterBar>
		);

		const trigger = screen.getByTestId('filter-panel-trigger');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens the filter panel when the trigger is clicked', async () => {
		render(
			<StickyFilterBar title="Test Bar">
				<input data-testid="filter-input" placeholder="search" />
			</StickyFilterBar>
		);

		act(() => {
			fireEvent.click(screen.getByTestId('filter-panel-trigger'));
		});

		await waitFor(() =>
			expect(screen.getByTestId('filter-panel-content')).toBeInTheDocument()
		);

		// filter controls are now rendered inside the sheet
		expect(screen.getByTestId('filter-input')).toBeInTheDocument();
	});

	it('panel has role="dialog" when open (Radix Dialog semantics)', async () => {
		render(
			<StickyFilterBar title="Test Bar">
				<div>Controls</div>
			</StickyFilterBar>
		);

		act(() => {
			fireEvent.click(screen.getByTestId('filter-panel-trigger'));
		});

		await waitFor(() =>
			expect(screen.getByRole('dialog')).toBeInTheDocument()
		);
	});

	it('panel includes a visually-hidden title for screen readers', async () => {
		render(
			<StickyFilterBar title="Marketplace" eyebrow="Filters">
				<div>Controls</div>
			</StickyFilterBar>
		);

		act(() => {
			fireEvent.click(screen.getByTestId('filter-panel-trigger'));
		});

		await waitFor(() =>
			expect(
				screen.getByText('Marketplace Filters')
			).toBeInTheDocument()
		);
	});

	it('closes the panel when Escape is pressed', async () => {
		render(
			<StickyFilterBar title="Test Bar">
				<div>Controls</div>
			</StickyFilterBar>
		);

		act(() => {
			fireEvent.click(screen.getByTestId('filter-panel-trigger'));
		});

		await waitFor(() =>
			expect(screen.getByRole('dialog')).toBeInTheDocument()
		);

		act(() => {
			fireEvent.keyDown(screen.getByRole('dialog'), {
				key: 'Escape',
				code: 'Escape',
				bubbles: true,
			});
		});

		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		);
	});

	it('inline controls are not rendered at all on mobile (no duplicate IDs)', () => {
		render(
			<StickyFilterBar title="Test Bar">
				<input id="unique-filter-id" data-testid="filter-input" />
			</StickyFilterBar>
		);

		// With the sheet closed, the input must not be in the DOM at all.
		expect(document.querySelectorAll('#unique-filter-id')).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// Desktop – no overlay, inline controls always visible
// ---------------------------------------------------------------------------

describe('StickyFilterBar – desktop layout', () => {
	beforeEach(() => {
		mockMatchMedia(false); // desktop
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders children inline without a trigger button', () => {
		render(
			<StickyFilterBar title="Test Bar">
				<input data-testid="filter-input" placeholder="search" />
			</StickyFilterBar>
		);

		expect(screen.getByTestId('filter-input')).toBeInTheDocument();
		expect(
			screen.queryByTestId('filter-panel-trigger')
		).not.toBeInTheDocument();
	});

	it('shows the "Filters stay pinned" label on desktop', () => {
		render(
			<StickyFilterBar title="Test Bar">
				<div>Controls</div>
			</StickyFilterBar>
		);

		expect(
			screen.getByText(/filters stay pinned while you browse/i)
		).toBeInTheDocument();
	});
});
