import type { ComponentProps, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LandingPage, { CREATOR_LIST_QUERY_KEY } from '@/pages/LandingPage';
import { courseService, type Course } from '@/services/course.service';

vi.mock('@/services/course.service', () => ({
	courseService: {
		getCourses: vi.fn(),
	},
}));

vi.mock('@/hooks/useNetworkMismatch', () => ({
	useNetworkMismatch: () => ({
		isMismatch: false,
		expectedChainName: 'Stellar Testnet',
	}),
}));

vi.mock('@/components/common/StellarConnectionQualityBadge', async () => {
	const React = await import('react');

	return {
		default: () => React.createElement('div', { role: 'status' }, 'RPC good'),
	};
});

vi.mock('@/components/common/CreatorCard', async () => {
	const React = await import('react');

	return {
		default: ({ creator }: { creator: { title: string } }) =>
			React.createElement(
				'article',
				{ 'aria-label': `Creator ${creator.title}` },
				creator.title
			),
	};
});

vi.mock('framer-motion', async () => {
	const React = await import('react');
	type MotionDivProps = ComponentProps<'div'> & {
		layout?: boolean;
		transition?: unknown;
	};

	return {
		AnimatePresence: ({ children }: { children: ReactNode }) =>
			React.createElement(React.Fragment, null, children),
		LayoutGroup: ({ children }: { children: ReactNode }) =>
			React.createElement(React.Fragment, null, children),
		motion: {
			div: ({ children, ...props }: MotionDivProps) => {
				const { layout, transition, ...divProps } = props;
				void layout;
				void transition;

				return React.createElement('div', divProps, children);
			},
			button: ({ children, ...props }: ComponentProps<'button'>) =>
				React.createElement('button', props, children),
		},
	};
});

const mockGetCourses = vi.mocked(courseService.getCourses);

const creatorList: Course[] = [
	{
		id: 'alex-rivers',
		title: 'Alex Rivers',
		description: 'Digital artist',
		price: 0.05,
		priceStroops: 500_000,
		creatorShareSupply: 120,
		holderCount: 12,
		instructorId: 'arivers',
		category: 'Art',
		level: 'BEGINNER',
		isVerified: true,
	},
];

const mockMatchMedia = () => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
};

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: Infinity },
		},
	});

const renderLandingPage = async () => {
	const queryClient = createTestQueryClient();
	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>
				<LandingPage />
			</MemoryRouter>
		</QueryClientProvider>
	);
	await waitFor(() => expect(mockGetCourses).toHaveBeenCalledTimes(1));

	return { queryClient };
};

describe('LandingPage creator refresh shortcut', () => {
	beforeEach(() => {
		mockMatchMedia();
		window.localStorage.clear();
		window.sessionStorage.clear();
		mockGetCourses.mockReset();
		mockGetCourses.mockResolvedValue(creatorList);
	});

	it('refreshes creator list data with Ctrl/Cmd + Alt + R', async () => {
		await renderLandingPage();

		const shortcutEvent = new KeyboardEvent('keydown', {
			key: 'r',
			code: 'KeyR',
			ctrlKey: true,
			altKey: true,
			bubbles: true,
			cancelable: true,
		});

		fireEvent(window, shortcutEvent);

		expect(shortcutEvent.defaultPrevented).toBe(true);
		expect(
			screen.getByLabelText('Ctrl/Cmd + Alt + R refreshes creator list data')
		).toBeInTheDocument();
		expect(
			await screen.findByText('Creator list refresh requested')
		).toBeInTheDocument();
		await waitFor(() => expect(mockGetCourses).toHaveBeenCalledTimes(2));
	});

	it('updates the featured holder count after the creator query cache is invalidated and refetched', async () => {
		const updatedCreatorList: Course[] = [
			{
				...creatorList[0],
				holderCount: 34,
			},
		];
		mockGetCourses
			.mockResolvedValueOnce(creatorList)
			.mockResolvedValueOnce(updatedCreatorList);

		const { queryClient } = await renderLandingPage();

		expect(await screen.findByText('12 key holders')).toBeInTheDocument();

		await queryClient.invalidateQueries({ queryKey: CREATOR_LIST_QUERY_KEY });

		expect(await screen.findByText('34 key holders')).toBeInTheDocument();
		expect(screen.queryByText('12 key holders')).not.toBeInTheDocument();
		expect(mockGetCourses).toHaveBeenCalledTimes(2);
	});

	it('does not trigger while focus is inside text inputs or textareas', async () => {
		await renderLandingPage();

		const input = document.createElement('input');
		const textarea = document.createElement('textarea');
		document.body.append(input, textarea);

		fireEvent.keyDown(input, {
			key: 'r',
			code: 'KeyR',
			ctrlKey: true,
			altKey: true,
			bubbles: true,
		});
		fireEvent.keyDown(textarea, {
			key: 'r',
			code: 'KeyR',
			ctrlKey: true,
			altKey: true,
			bubbles: true,
		});

		await new Promise(resolve => window.setTimeout(resolve, 0));

		expect(mockGetCourses).toHaveBeenCalledTimes(1);
		expect(
			screen.queryByText('Creator list refresh requested')
		).not.toBeInTheDocument();

		input.remove();
		textarea.remove();
	});
});
