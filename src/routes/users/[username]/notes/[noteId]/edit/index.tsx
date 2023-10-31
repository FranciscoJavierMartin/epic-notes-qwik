import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { kodyNotes } from '@/db/db.server';
import { component$ } from '@builder.io/qwik';
import { Form, routeLoader$ } from '@builder.io/qwik-city';

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
		<Form>
			<div>
				<div>
					<Label>Title</Label>
					<Input name='title' value={data.value.note.title} />
				</div>
			</div>
		</Form>
	);
});
