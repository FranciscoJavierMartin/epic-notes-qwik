import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import {
	Form,
	routeAction$,
	routeLoader$,
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
		title: z
			.string()
			.trim()
			.min(1, 'Title is required')
			.max(100, 'Title must be at most 100 characters'),
		content: z
			.string()
			.trim()
			.min(1, 'Content is required')
			.max(10000, 'Content must be at most 10000 characters'),
	}),
);

function ErrorList({ id, errors }: { id?: string; errors?: string[] | null }) {
	return errors?.length ? (
		<ul id={id} class='flex flex-col gap-1'>
			{errors.map((error, i) => (
				<li key={i} class='text-[10px] text-foreground-destructive'>
					{error}
				</li>
			))}
		</ul>
	) : null;
}

export default component$(() => {
	const data = useNote();
	const editNote = useEditNote();
	const formEl = useSignal<HTMLFormElement>();

	// FIXME: Fix autofocus when error happens
	useTask$(({ track }) => {
		track(() => editNote.value?.failed);

		if (formEl.value && editNote.value?.failed) {
			if (formEl.value.matches('[aria-invalid="true"]')) {
				formEl.value.focus();
			} else {
				const firstInvalid = formEl.value.querySelector(
					'[aria-invalid="true"]',
				);

				if (firstInvalid instanceof HTMLElement) {
					firstInvalid.focus();
				}
			}
		}
	});

	return (
		<div>
			<Form
				id='note-editor'
				action={editNote}
				ref={formEl}
				tabIndex={-1}
				aria-invalid={Boolean(editNote.value?.formErrors?.length) || undefined}
				aria-describedby={
					editNote.value?.formErrors?.length ? 'form-error' : undefined
				}
				class='flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12'
			>
				<div class='flex flex-col gap-1'>
					<div>
						<Label for='note-title'>Title</Label>
						<Input
							id='note-title'
							name='title'
							value={data.value.note.title}
							required
							maxLength={100}
							aria-invalid={
								Boolean(editNote.value?.fieldErrors?.title?.length) || undefined
							}
							aria-describedby={
								editNote.value?.fieldErrors?.title?.length
									? 'title-error'
									: undefined
							}
							autoFocus
						/>
						<div class='min-h-[32px] px-4 pb-3 pt-1'>
							<ErrorList
								id={
									editNote.value?.fieldErrors?.title?.length
										? 'title-error'
										: undefined
								}
								errors={editNote.value?.fieldErrors?.title}
							/>
						</div>
					</div>
					<div>
						<Label for='note-title'>Content</Label>
						<Textarea
							id='note-content'
							name='content'
							value={data.value.note.content}
							required
							maxLength={10000}
							aria-invalid={
								Boolean(editNote.value?.fieldErrors?.content?.length) ||
								undefined
							}
							aria-describedby={
								editNote.value?.fieldErrors?.content?.length
									? 'content-error'
									: undefined
							}
						/>
						<div class='min-h-[32px] px-4 pb-3 pt-1'>
							<ErrorList
								id={
									editNote.value?.fieldErrors?.content?.length
										? 'content-error'
										: undefined
								}
								errors={editNote.value?.fieldErrors?.content}
							/>
						</div>
					</div>
				</div>
				<ErrorList
					id={editNote.value?.formErrors?.length ? 'form-error' : undefined}
					errors={editNote.value?.formErrors}
				/>
			</Form>
			<div class='floating-toolbar'>
				<Button form='note-editor' variant='destructive' type='reset'>
					Reset
				</Button>
				<StatusButton
					form='note-editor'
					type='submit'
					disabled={editNote.isRunning}
					status={editNote.isRunning ? 'pending' : 'idle'}
				>
					Submit
				</StatusButton>
			</div>
		</div>
	);
});
