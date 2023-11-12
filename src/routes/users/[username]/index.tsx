import { component$ } from '@builder.io/qwik';
import {
	type DocumentHead,
	Link,
	routeLoader$,
	useLocation,
} from '@builder.io/qwik-city';
import Spacer from '@/components/ui/spacer';
import { Button } from '@/components/ui';
import { prisma } from '@/db/db.server';
import { getUserImgSrc } from '@/utils/misc';

export const useUserProfile = routeLoader$(async ({ params, error }) => {
	const user = await prisma.user.findFirst({
		select: {
			name: true,
			username: true,
			createdAt: true,
			image: { select: { id: true } },
		},
		where: { username: params.username },
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	return {
		user,
		userJoinedDisplay: user.createdAt.toLocaleDateString(),
	};
});

export default component$(() => {
	const location = useLocation();
	const data = useUserProfile();
	const userDisplayName = data.value.user.name ?? data.value.user.username;

	return (
		<div class='container mb-48 mt-36 flex flex-col items-center justify-center'>
			<Spacer size='4xs' />
			<div class='container flex flex-col items-center rounded-3xl bg-muted p-12'>
				<div class='relative w-52'>
					<div class='absolute -top-40'>
						<div class='relative'>
							<img
								src={getUserImgSrc(data.value.user.image?.id)}
								alt={userDisplayName}
								width={208}
								height={208}
								class='h-52 w-52 rounded-full object-cover'
							/>
						</div>
					</div>
				</div>

				<Spacer size='sm' />

				<div class='flex flex-col items-center'>
					<div class='flex flex-wrap items-center justify-center gap-4'>
						<h1 class='text-center text-h2'>
							{data.value.user.name ?? data.value.user.username}
						</h1>
					</div>
					<p class='mt-2 text-center text-muted-foreground'>
						Joined {data.value.userJoinedDisplay}
					</p>
					<div class='mt-10 flex gap-4'>
						<Button asChild>
							<Link href={`/users/${location.params.username}/notes`} prefetch>
								{userDisplayName}'s notes
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
});

export const head: DocumentHead = ({ resolveValue, params }) => {
	const data = resolveValue(useUserProfile);
	const displayName = data.user.name ?? params.username;

	return {
		title: `${displayName} | Epic Notes`,
		meta: [
			{
				name: 'description',
				content: `Profile of ${displayName} on Epic Notes`,
			},
		],
	};
};
