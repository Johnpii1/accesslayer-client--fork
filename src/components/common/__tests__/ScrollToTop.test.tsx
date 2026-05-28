import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import ScrollToTop from '@/components/common/ScrollToTop';

describe('ScrollToTop', () => {
	beforeEach(() => {
		vi.stubGlobal('scrollTo', vi.fn());
		// Set initial scroll position
		window.scrollY = 0;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('is initially hidden', () => {
		render(<ScrollToTop threshold={100} />);
		expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
	});

	it('appears after scrolling past the threshold', () => {
		render(<ScrollToTop threshold={100} />);
		
		// Simulate scroll
		window.scrollY = 150;
		fireEvent.scroll(window);

		expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
	});

	it('hides when scrolling back above the threshold', async () => {
		render(<ScrollToTop threshold={100} />);
		
		// Scroll down
		window.scrollY = 150;
		fireEvent.scroll(window);
		expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();

		// Scroll up
		window.scrollY = 50;
		fireEvent.scroll(window);
		
		await waitForElementToBeRemoved(() => screen.queryByLabelText('Scroll to top'));
	});

	it('triggers window.scrollTo when clicked', () => {
		render(<ScrollToTop threshold={100} />);
		
		window.scrollY = 150;
		fireEvent.scroll(window);

		const button = screen.getByLabelText('Scroll to top');
		fireEvent.click(button);

		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: 'smooth',
		});
	});
});
