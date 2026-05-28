import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionErrorBoundary from '@/components/common/SectionErrorBoundary';

// Mock component that throws an error
const BuggyComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
	if (shouldThrow) {
		throw new Error('Test error');
	}
	return <div>Normal Content</div>;
};

describe('SectionErrorBoundary', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders children when no error occurs', () => {
		render(
			<SectionErrorBoundary>
				<BuggyComponent />
			</SectionErrorBoundary>
		);
		expect(screen.getByText('Normal Content')).toBeInTheDocument();
	});

	it('renders fallback UI when an error occurs', () => {
		// Suppress console.error for the expected error
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<SectionErrorBoundary sectionName="Test Section">
				<BuggyComponent shouldThrow={true} />
			</SectionErrorBoundary>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
		expect(screen.getByText(/Test Section/i)).toBeInTheDocument();
		expect(consoleSpy).toHaveBeenCalled();
	});

	it('resets error state when Retry button is clicked', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		const { rerender } = render(
			<SectionErrorBoundary>
				<BuggyComponent shouldThrow={true} />
			</SectionErrorBoundary>
		);

		expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

		// Update children to not throw anymore
		rerender(
			<SectionErrorBoundary>
				<BuggyComponent shouldThrow={false} />
			</SectionErrorBoundary>
		);

		// Click retry
		fireEvent.click(screen.getByText(/retry/i));

		expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
		expect(screen.getByText('Normal Content')).toBeInTheDocument();
	});

	it('applies custom minHeight and className', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<SectionErrorBoundary minHeight={500} className="custom-class">
				<BuggyComponent shouldThrow={true} />
			</SectionErrorBoundary>
		);

		const alert = screen.getByRole('alert');
		expect(alert).toHaveStyle('min-height: 500px');
		expect(alert).toHaveClass('custom-class');
	});
});
