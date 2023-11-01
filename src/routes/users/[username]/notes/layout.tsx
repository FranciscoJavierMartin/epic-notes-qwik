import { db, kodyNotes } from '@/db/db.server';
import { cn } from '@/utils/misc';
import { Slot, component$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation } from '@builder.io/qwik-city';

export const useOwnerNotes = routeLoader$(async ({ params, error }) => {
	// const owner = db.user.findFirst({
	// 	where: {
	// 		username: {
	// 			equals: params.username,
	// 		},
	// 	},
	// });

	// if (!owner) {
	// 	throw error(404, 'Owner not found');
	// }

	// const notes = db.note
	// 	.findMany({
	// 		where: {
	// 			owner: {
	// 				username: {
	// 					equals: params.username,
	// 				},
	// 			},
	// 		},
	// 	})
	// 	.map(({ id, title }) => ({ id, title }));

	const owner = {
		id: '9d6eba59daa2fc2078cf8205cd451041',
		email: 'kody@kcd.dev',
		username: 'kody',
		name: 'Kody',
		createdAt: new Date('2023-10-30T22:27:04.762Z'),
	};

	const notes = kodyNotes.map(({ id, title }) => ({ id, title }));

	return { owner, notes };
});

export default component$(() => {
	const location = useLocation();
	const data = useOwnerNotes();

	return (
		<main class='container flex h-full min-h-[400px] px-0 pb-12 md:px-8'>
			<div class='bg-muted grid w-full grid-cols-4 pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0'>
				<div class='relative col-span-1'>
					<div class='absolute inset-0 flex flex-col'>
						<Link
							href={`/users/${location.params.username}`}
							class='pb-4 pl-8 pr-4 pt-12'
						>
							<h1 class='text-base font-bold md:text-lg lg:text-left lg:text-2xl'>
								{data.value.owner.name ?? data.value.owner.username}'s Notes
							</h1>
						</Link>
						<ul class='overflow-y-auto overflow-x-hidden pb-12'>
							{data.value.notes.map((note) => (
								<li key={note.id} class='p-1 pr-0'>
									{/* FIXME: Fix current link */}
									<Link
										href={`/users/${location.params.username}/notes/${note.id}`}
										prefetch
										class={cn(
											'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl',
											location.url.pathname ===
												`/users/${location.params.username}/notes/${note.id}/` &&
												'bg-accent',
										)}
									>
										{note.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div class='bg-accent relative col-span-3 md:rounded-r-3xl'>
					<Slot />
				</div>
			</div>
		</main>
	);
});
