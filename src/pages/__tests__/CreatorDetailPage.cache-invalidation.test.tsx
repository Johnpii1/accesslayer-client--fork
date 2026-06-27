import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreatorProfileStatRow from '@/components/common/CreatorProfileStatRow';
import { courseService, type Course } from '@/services/course.service';
import { formatCompactNumber } from '@/utils/numberFormat.utils';

vi.mock('@/services/course.service', () => ({
	courseService: {
		getCourse: vi.fn(),
	},
}));

const creatorDetailQueryKey = (creatorId: string) => ['creator', creatorId] as const;
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

function CreatorHolderCount({ creatorId }: { creatorId: string }) {
	const { data: creator } = useQuery({
		queryKey: creatorDetailQueryKey(creatorId),
		queryFn: () => courseService.getCourse(creatorId),
	});

	const holderCount = creator?.creatorShareSupply;
	const holderCountDisplay =
		holderCount === undefined
			? 'Key holders unavailable'
			: holderCount === 0
				? 'No key holders yet'
				: `${formatCompactNumber(holderCount)} key holders`;

	return (
		<CreatorProfileStatRow
			items={[
				{
					label: 'Holder count',
					value: holderCountDisplay,
				},
			]}
		/>
	);
}

const renderCreatorHolderCount = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	render(
		<QueryClientProvider client={queryClient}>
			<CreatorHolderCount creatorId="alex-rivers" />
		</QueryClientProvider>
	);

	return queryClient;
};

describe('creator detail holder count cache invalidation', () => {
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

		const queryClient = renderCreatorHolderCount();

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
