import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreatorDetailPage from '@/pages/CreatorDetailPage';
import { creatorDetailQueryKey } from '@/pages/creatorDetail.query';
import { courseService, type Course } from '@/services/course.service';

vi.mock('@/services/course.service', () => ({
	courseService: {
		getCourse: vi.fn(),
	},
}));

const mockGetCourse = vi.mocked(courseService.getCourse);

const buildCreator = (creatorShareSupply: number): Course => ({
	id: 'alex-rivers',
	title: 'Alex Rivers',
	description: 'Digital artist',
	price: 0.05,
	priceStroops: 500_000,
	creatorShareSupply,
	instructorId: 'arivers',
	category: 'Art',
	level: 'BEGINNER',
	isVerified: true,
});

const renderCreatorDetailPage = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[`/creator/alex-rivers`]}>
				<Routes>
					<Route path="/creator/:creatorId" element={<CreatorDetailPage />} />
				</Routes>
			</MemoryRouter>
		</QueryClientProvider>
	);

	return queryClient;
};

describe('CreatorDetailPage holder count cache invalidation', () => {
	beforeEach(() => {
		mockGetCourse.mockReset();
	});

	it('updates the displayed holder count after React Query cache invalidation and refetch', async () => {
		const reloadSpy = vi.fn();
		vi.stubGlobal('location', {
			...window.location,
			reload: reloadSpy,
		});
		mockGetCourse
			.mockResolvedValueOnce(buildCreator(120))
			.mockResolvedValueOnce(buildCreator(245));

		const queryClient = renderCreatorDetailPage();

		expect(await screen.findByText('120 key holders')).toBeInTheDocument();

		await queryClient.invalidateQueries({
			queryKey: creatorDetailQueryKey('alex-rivers'),
		});

		expect(await screen.findByText('245 key holders')).toBeInTheDocument();
		expect(screen.queryByText('120 key holders')).not.toBeInTheDocument();
		expect(reloadSpy).not.toHaveBeenCalled();
		await waitFor(() => expect(mockGetCourse).toHaveBeenCalledTimes(2));
	});
});
