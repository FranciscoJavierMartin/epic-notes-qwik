import { $, component$ } from '@builder.io/qwik';
import { routeLoader$, z } from '@builder.io/qwik-city';
import {
	useForm,
	type InitialValues,
	type SubmitHandler,
	formAction$,
	zodForm$,
} from '@modular-forms/qwik';
import InputForm from '@/components/form/input-form';
import { prisma } from '@/db/db.server';
import { Button, StatusButton } from '@/components/ui';

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
	// images: z.array(ImageFieldsetSchema).max(5).optional(),
});

type EditNoteForm = typeof NoteEditorSchema._type;

export const useFormLoader = routeLoader$<InitialValues<EditNoteForm>>(
	async ({ params, error }) => {
		const note = await prisma.note.findFirst({
			select: {
				title: true,
				content: true,
			},
			where: {
				id: 'd27a197e',
			},
		});

		if (!note) {
			throw error(404, 'Note not found');
		}

		return {
			...note,
		};
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
				<div class='flex flex-col gap-1'>
					<Field name='title'>
						{(field, props) => (
							<InputForm
								{...props}
								autoFocus
								id='note-title'
								value={field.value}
								error={field.error}
								placeholder='Title'
							/>
						)}
					</Field>
					<Field name='content'>
						{(field, props) => (
							<div class='flex flex-col'>
								<input
									{...props}
									type='text'
									value={field.value}
									placeholder='Content'
									class='border border-black '
								/>
								{field.error && <div class='text-red-600'>{field.error}</div>}
							</div>
						)}
					</Field>
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
