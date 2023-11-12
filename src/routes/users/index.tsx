import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$, z } from '@builder.io/qwik-city';
import { SearchBar } from '@/components/fields';
import { ErrorList } from '@/components/ui';
import { prisma } from '@/db/db.server';
import { getUserImgSrc } from '@/utils/misc';

const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
	imageId: z.string().nullable(),
});

const UserSearchResultsSchema = z.array(UserSearchResultSchema);

export const useUserSearch = routeLoader$(async ({ redirect, query }) => {
	const searchTerm = query.get('search');

	if (searchTerm === '') {
		throw redirect(302, '/users');
	}

	const like = `%${searchTerm ?? ''}%`;

	const rawUsers = await prisma.$queryRaw`
		SELECT User.id, User.username, User.name, UserImage.id AS imageId
		FROM User
		LEFT JOIN UserImage ON UserImage.userId = User.id
		WHERE User.username LIKE ${like}
		OR User.name LIKE ${like}
		ORDER BY (
			SELECT Note.updatedAt
			FROM Note
			WHERE Note.ownerId = user.id
			ORDER BY Note.updatedAt DESC
			LIMIT 1
		) DESC
		LIMIT 50
	`;

	const result = import.meta.env.PROD
		? ({
				success: true,
				data: rawUsers as z.infer<typeof UserSearchResultsSchema>,
		  } as const)
		: UserSearchResultsSchema.safeParse(rawUsers);

	return result.success
		? ({ status: 'idle', users: result.data } as const)
		: ({
				status: 'error',
				error: result.error.message,
		  } as const);
});

export default component$(() => {
	const data = useUserSearch();

	if (data.value.status === 'error') {
		console.error(data.value.error);
	}

	return (
		<div class='container mb-48 mt-36 flex flex-col items-center justify-center gap-6'>
			<h1 class='text-h1'>Epic Notes Users</h1>
			<div class='w-full max-w-[700px]'>
				<SearchBar status={data.value.status as any} autoFocus autoSubmit />
			</div>
			<main>
				{data.value.status === 'idle' ? (
					data.value.users.length ? (
						<ul class='flex w-full flex-wrap items-center justify-center gap-4 delay-200'>
							{data.value.users.map((user) => (
								<li key={user.id}>
									<Link
										href={user.username}
										class='flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3'
									>
										<img
											alt={user.name ?? user.username}
											src={getUserImgSrc(user.imageId)}
											width={64}
											height={64}
											class='h-16 w-16 rounded-full'
										/>
										{user.name ? (
											<span class='w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md'>
												{user.name}
											</span>
										) : null}
										<span class='w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground'>
											{user.username}
										</span>
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p>No users found</p>
					)
				) : data.value.status === 'error' ? (
					<ErrorList errors={['There was an error parsing the result']} />
				) : null}
			</main>
		</div>
	);
});
