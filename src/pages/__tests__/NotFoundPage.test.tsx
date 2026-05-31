import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import NotFoundPage from '@/pages/NotFoundPage';

describe('NotFoundPage', () => {
	it('points unknown routes back to the marketplace home', () => {
		render(
			<MemoryRouter initialEntries={['/missing-route']}>
				<NotFoundPage />
			</MemoryRouter>
		);

		expect(
			screen.getByRole('heading', {
				name: /this marketplace path is not live yet/i,
			})
		).toBeInTheDocument();

		expect(
			screen.getByRole('link', { name: /back to marketplace/i })
		).toHaveAttribute('href', '/');
	});
});
