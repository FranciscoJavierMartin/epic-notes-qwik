import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$ } from '@builder.io/qwik-city';
import userAvatar from '@/assets/user.png';
import { SearchBar } from '@/components/fields';
import { cn } from '@/utils/misc';

export const useOwnerNotes = routeLoader$(
	async ({ params, error, redirect, query }) => {
		const searchTerm = query.get('search');

		if (searchTerm === '') {
			redirect(302, '/users');
		}

		return {
			status: 'idle',
			users: [
				{
					id: '9d6eba59daa2fc2078cf8205cd451041',
					email: 'kody@kcd.dev',
					username: 'kody',
					name: 'Kody',
					createdAt: new Date('2023-10-30T22:27:04.762Z'),
					image: userAvatar,
				},
				{
					id: '9d6eba59daa2fc2078cf8205cd451042',
					email: 'john@doe.dev',
					username: 'john',
					name: 'John',
					createdAt: new Date('2023-10-30T22:27:04.762Z'),
					image: userAvatar,
				},
			].map((u) => ({
				id: u.id,
				username: u.username,
				name: u.name,
				image: u.image,
			})),
		};
	},
);

export default component$(() => {
	const data = useOwnerNotes();

	return (
		<div class='container mb-48 mt-36 flex flex-col items-center justify-center gap-6'>
			<h1 class='text-h1'>Epic Notes Users</h1>
			<div class='w-full max-w-[700px]'>
				<SearchBar status={data.value.status as any} autoFocus autoSubmit />
			</div>
			<main>
				{data.value.status === 'idle' ? (
					data.value.users.length ? (
						<ul
							class={cn(
								'flex w-full flex-wrap items-center justify-center gap-4 delay-200',
								{ 'opacity-50': true },
							)}
						>
							{data.value.users.map((user) => (
								<li key={user.id}>
									<Link
										href={user.username}
										class='flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3'
									>
										<img
											alt={user.name ?? user.username}
											src={user.image}
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
				) : null}
			</main>
		</div>
	);
});
