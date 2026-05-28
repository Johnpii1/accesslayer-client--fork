import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StaleDataWarning from '@/components/common/StaleDataWarning';

describe('StaleDataWarning (#301)', () => {
	it('renders nothing when not stale', () => {
		const { container } = render(<StaleDataWarning stale={false} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders the standard copy when stale with no ageMs', () => {
		render(<StaleDataWarning stale={true} />);
		expect(
			screen.getByText(/Stats may be out of date\. Refreshing…/)
		).toBeInTheDocument();
	});

	it('appends the formatted age when ageMs is provided', () => {
		render(<StaleDataWarning stale={true} ageMs={180_000} />);
		expect(
			screen.getByText(/Updated 3 min ago/)
		).toBeInTheDocument();
	});

	it('uses status role + polite live region for assistive tech', () => {
		render(<StaleDataWarning stale={true} ageMs={2_000} />);
		const status = screen.getByRole('status');
		expect(status).toHaveAttribute('aria-live', 'polite');
	});

	it('respects a custom message override', () => {
		render(
			<StaleDataWarning
				stale={true}
				ageMs={5_000}
				message="Custom stale copy"
			/>
		);
		expect(screen.getByText(/Custom stale copy/)).toBeInTheDocument();
		// The age suffix is still appended.
		expect(screen.getByRole('status').textContent).toMatch(/Custom stale copy/);
	});
});
