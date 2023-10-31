import { component$ } from '@builder.io/qwik';
import { Form, routeLoader$ } from '@builder.io/qwik-city';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Textarea from '@/components/ui/textarea';
import { kodyNotes } from '@/db/db.server';

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
		<Form class='flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12'>
			<div class='flex flex-col gap-1'>
				<div>
					<Label>Title</Label>
					<Input name='title' value={data.value.note.title} />
				</div>
				<div>
					<Label>Content</Label>
					<Textarea name='content' value={data.value.note.content} />
				</div>
			</div>
			<div class='floating-toolbar'>
				<Button variant='destructive' type='reset'>
					Reset
				</Button>
				<Button type='submit'>Submit</Button>
			</div>
		</Form>
	);
});
