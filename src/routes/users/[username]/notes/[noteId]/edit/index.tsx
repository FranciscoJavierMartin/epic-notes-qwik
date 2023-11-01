import { component$ } from '@builder.io/qwik';
import {
	Form,
	routeAction$,
	routeLoader$,
	useNavigate,
	z,
	zod$,
} from '@builder.io/qwik-city';
import { Button, Label, Input, Textarea, StatusButton } from '@/components/ui';
import { kodyNotes } from '@/db/db.server';

export const useNote = routeLoader$(async ({ params, error }) => {
	const note = kodyNotes.find((note) => note.id === params.noteId);

	if (!note) {
		throw error(404, 'Note not found');
	}

	return { note: { title: note.title, content: note.content } };
});

export const useEditNote = routeAction$(
	async ({ title, content }, { params, redirect }) => {
		redirect(302, `/users/${params.username}/notes/${params.noteId}`);
	},
	zod$({
		title: z.string(),
		content: z.string(),
	}),
);

export default component$(() => {
	const data = useNote();
	const editNote = useEditNote();

	return (
		<Form
			action={editNote}
			class='flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12'
		>
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
				<StatusButton
					type='submit'
					disabled={editNote.isRunning}
					status={editNote.isRunning ? 'pending' : 'idle'}
				>
					Submit
				</StatusButton>
			</div>
		</Form>
	);
});
