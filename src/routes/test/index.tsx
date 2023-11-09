import { $, component$ } from '@builder.io/qwik';
import { routeLoader$, z } from '@builder.io/qwik-city';
import {
	useForm,
	type InitialValues,
	type SubmitHandler,
	formAction$,
	zodForm$,
} from '@modular-forms/qwik';
import { prisma } from '@/db/db.server';
import { Button, Label, StatusButton } from '@/components/ui';
import { InputField, TextareaField } from '@/components/fields';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;
const CONTENT_MIN_LENGTH = 1;
const CONTENT_MAX_LENGTH = 10_000;

const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	imageFile: z
		.any()
		.refine((file) => file instanceof File && file.size <= MAX_UPLOAD_SIZE)
		.optional(),
	altText: z.string().optional(),
});

const NoteEditorSchema = z.object({
	title: z
		.string()
		.trim()
		.min(TITLE_MIN_LENGTH, 'Title is required')
		.max(
			TITLE_MAX_LENGTH,
			`Title must be at most ${TITLE_MAX_LENGTH} characters`,
		),
	content: z
		.string()
		.trim()
		.min(CONTENT_MIN_LENGTH, 'Content is required')
		.max(
			CONTENT_MAX_LENGTH,
			`Content must be at most ${CONTENT_MAX_LENGTH} characters`,
		),
	images: z.array(ImageFieldsetSchema).max(5).optional(),
});

type EditNoteForm = typeof NoteEditorSchema._type;

export const useFormLoader = routeLoader$<InitialValues<EditNoteForm>>(
	async ({ params, error }) => {
		const note = await prisma.note.findFirst({
			select: {
				title: true,
				content: true,
				images: {
					select: {
						id: true,
						altText: true,
					},
				},
			},
			where: {
				id: 'd27a197e',
			},
		});

		if (!note) {
			throw error(404, 'Note not found');
		}

		return note;
	},
);

export const useFormAction = formAction$<EditNoteForm>((values) => {
	console.log(values);
}, zodForm$(NoteEditorSchema));

export default component$(() => {
	const [editNoteForm, { Form, Field }] = useForm<EditNoteForm>({
		loader: useFormLoader(),
		action: useFormAction(),
		validate: zodForm$(NoteEditorSchema),
	});

	const handleSubmit = $<SubmitHandler<EditNoteForm>>(() => {});

	return (
		<div>
			<Form
				id='note-editor'
				onSubmit$={handleSubmit}
				class='flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12'
				encType='multipart/form-data'
			>
				<button type='submit' class='hidden' />
				<div class='flex flex-col gap-1'>
					<Field name='title'>
						{(field, props) => (
							<InputField
								{...props}
								labelProps={{ children: 'Title' }}
								error={field.error}
								autoFocus
								id='note-title'
								value={field.value}
								placeholder='Title'
								required
								maxLength={TITLE_MAX_LENGTH}
							/>
						)}
					</Field>
					<Field name='content'>
						{(field, props) => (
							<TextareaField
								{...props}
								labelProps={{ children: 'Content' }}
								error={field.error}
								id='note-content'
								value={field.value}
								required
								maxLength={CONTENT_MAX_LENGTH}
							/>
						)}
					</Field>
					<div>
						<Label>Images</Label>
						<ul class='flex flex-col gap-4'></ul>
					</div>
				</div>
			</Form>
			<div class='floating-toolbar'>
				<Button form='note-editor' variant='destructive' type='reset'>
					Reset
				</Button>
				<StatusButton
					form='note-editor'
					type='submit'
					disabled={editNoteForm.invalid}
					status={editNoteForm.submitting ? 'pending' : 'idle'}
				>
					Submit
				</StatusButton>
			</div>
		</div>
	);
});
