import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import CreatorProfileStatRow from '@/components/common/CreatorProfileStatRow';
import { courseService } from '@/services/course.service';
import { creatorDetailQueryKey } from '@/pages/creatorDetail.query';
import { formatCompactNumber } from '@/utils/numberFormat.utils';

export default function CreatorDetailPage() {
	const { creatorId = '' } = useParams<{ creatorId: string }>();
	const {
		data: creator,
		isLoading,
		isError,
	} = useQuery({
		queryKey: creatorDetailQueryKey(creatorId),
		queryFn: () =>
			courseService.getCourse(creatorId, {
				forceRefresh: true,
			}),
		enabled: creatorId.length > 0,
	});

	if (isLoading) {
		return (
			<main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
				<p role="status">Loading creator profile…</p>
				<CreatorProfileStatRow items={[]} isLoading skeletonCount={1} />
			</main>
		);
	}

	if (isError || !creator) {
		return (
			<main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
				<Link className="text-amber-300" to="/">
					Back to creators
				</Link>
				<h1 className="mt-6 text-3xl font-bold">Unable to load creator</h1>
			</main>
		);
	}

	const holderCount = creator.creatorShareSupply;
	const holderCountDisplay =
		holderCount === undefined
			? 'Key holders unavailable'
			: holderCount === 0
				? 'No key holders yet'
				: `${formatCompactNumber(holderCount)} key holders`;

	return (
		<main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
			<Link className="text-amber-300" to="/">
				Back to creators
			</Link>
			<section className="mx-auto mt-8 max-w-4xl">
				<p className="text-sm uppercase tracking-[0.3em] text-amber-200/60">
					Creator profile
				</p>
				<h1 className="mt-3 text-4xl font-bold">{creator.title}</h1>
				<p className="mt-4 max-w-2xl text-white/70">{creator.description}</p>

				<CreatorProfileStatRow
					className="mt-8"
					items={[
						{
							label: 'Holder count',
							value: holderCountDisplay,
						},
					]}
				/>
			</section>
		</main>
	);
}
