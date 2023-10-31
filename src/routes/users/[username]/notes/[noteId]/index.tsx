import Button from '@/components/ui/button';
import { kodyNotes } from '@/db/db.server';
import { component$ } from '@builder.io/qwik';
import { Form, Link, routeLoader$ } from '@builder.io/qwik-city';

export const useNote = routeLoader$(async ({ params, error }) => {
	const note = kodyNotes.find((note) => note.id === params.noteId);

	if (!note) {
		throw error(404, 'Note not found');
	}

	return { note: { title: note.title, content: note.content } };
});

export default component$(() => {
	const data = useNote();

	return (
		<div class='absolute inset-0 flex flex-col px-10'>
			<h2 class='text-h2 mb-2 pt-12 lg:mb-6'>{data.value.note.title}</h2>
			<div class='overflow-y-auto pb-24'>
				<p class='whitespace-break-spaces text-sm md:text-lg'>
					{data.value.note.content}
				</p>
			</div>
			<div class='floating-toolbar'>
				<Form>
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
