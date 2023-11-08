import { Slot, component$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation } from '@builder.io/qwik-city';
import { cn } from '@/utils/misc';
import { prisma } from '@/db/db.server';
import userAvatar from '@/assets/user.png';

export const useOwnerNotes = routeLoader$(async ({ params, error }) => {
	const owner = await prisma.user.findFirst({
		select: {
			name: true,
			username: true,
			image: { select: { id: true } },
			notes: { select: { id: true, title: true } },
		},
		where: {
			username: params.username,
		},
	});

	if (!owner) {
		throw error(404, 'Owner not found');
	}
	return { owner };
});

export default component$(() => {
	const location = useLocation();
	const data = useOwnerNotes();
	const ownerDisplayName: string =
		data.value.owner.name ?? data.value.owner.username;

	return (
		<main class='container flex h-full min-h-[400px] px-0 pb-12 md:px-8'>
			<div class='grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0'>
				<div class='relative col-span-1'>
					<div class='absolute inset-0 flex flex-col'>
						<Link
							href={`/users/${data.value.owner.username}`}
							class='flex flex-col items-center justify-center gap-2 bg-muted pb-4 pl-8 pr-4 pt-12 lg:flex-row lg:justify-start lg:gap-4'
						>
							<img
								src={userAvatar}
								alt={ownerDisplayName}
								class='h-16 w-16 rounded-full object-cover lg:h-24 lg:w-24'
								height={64}
								width={64}
							/>
							<h1 class='text-center text-base font-bold md:text-lg lg:text-left lg:text-2xl'>
								{ownerDisplayName}'s Notes
							</h1>
						</Link>
						<ul class='overflow-y-auto overflow-x-hidden pb-12'>
							{data.value.owner.notes.map((note) => (
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
				<div class='relative col-span-3 bg-accent md:rounded-r-3xl'>
					<Slot />
				</div>
			</div>
		</main>
	);
});
