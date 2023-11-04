import { component$ } from '@builder.io/qwik';
import {
	type DocumentHead,
	Form,
	Link,
	routeAction$,
	routeLoader$,
	z,
	zod$,
} from '@builder.io/qwik-city';
import { Button } from '@/components/ui';
import { useOwnerNotes } from '../layout';
import { kodyNotes } from '@/db/db.server';

export const head: DocumentHead = ({ resolveValue, params }) => {
	const data = resolveValue(useOwnerNotes);
	const { note } = resolveValue(useNote);

	const displayName = data.owner.name ?? params.username;
	const noteTitle = note.title ?? 'Note';
	const noteContentsSummary =
		note && note.content.length > 100
			? note.content.slice(0, 97) + '...'
			: 'No content';

	return {
		title: `${noteTitle} | ${displayName}'s Notes | Epic Notes`,
		meta: [
			{
				name: 'description',
				content: noteContentsSummary,
			},
		],
	};
};

export const useNote = routeLoader$(async ({ params, error }) => {
	const note = kodyNotes.find((note) => note.id === params.noteId);

	if (!note) {
		throw error(404, 'Note not found');
	}

	return {
		note: {
			title: note.title,
			content: note.content,
			images: [] as { id: string; altText: string }[],
		},
	};
});

export const useRemoveNote = routeAction$(
	async ({ intent }, { params, redirect }) => {
		redirect(302, `/users/${params.username}/notes/`);
	},
	zod$({
		intent: z.enum(['delete']),
	}),
);

export default component$(() => {
	const data = useNote();
	const removeNote = useRemoveNote();

	return (
		<div class='absolute inset-0 flex flex-col px-10'>
			<h2 class='mb-2 pt-12 text-h2 lg:mb-6'>{data.value.note.title}</h2>
			<div class='overflow-y-auto pb-24'>
				<ul class='flex flex-wrap gap-5 py-5'>
					{data.value.note.images.map((image) => (
						<li key={image.id}>
							<a href={`/api/images/${image.id}`}>
								<img
									src={`/api/images/${image.id}`}
									alt={image.altText ?? ''}
									class='h-32 w-32 rounded-lg object-cover'
									width={128}
									height={128}
								/>
							</a>
						</li>
					))}
				</ul>
				<p class='whitespace-break-spaces text-sm md:text-lg'>
					{data.value.note.content}
				</p>
			</div>
			<div class='floating-toolbar'>
				<Form action={removeNote}>
					<Button
						type='submit'
						variant='destructive'
						name='intent'
						value='delete'
					>
						Delete
					</Button>
				</Form>
				<Button asChild>
					<Link href='edit'>Edit</Link>
				</Button>
			</div>
		</div>
	);
});
