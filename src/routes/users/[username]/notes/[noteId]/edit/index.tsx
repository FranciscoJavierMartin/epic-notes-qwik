import {
	component$,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import {
	Form,
	routeAction$,
	routeLoader$,
	z,
	zod$,
} from '@builder.io/qwik-city';
import {
	Button,
	Label,
	ImagePicker,
	StatusButton,
	ErrorList,
	Icon,
} from '@/components/ui';
import { TextareaField, InputField } from '@/components/fields';
import { prisma } from '@/db/db.server';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10000;

const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	imageFile: z
		.any()
		.refine((file) => file.size <= MAX_UPLOAD_SIZE)
		.optional(),
	altText: z.string().optional(),
});

type ImageFieldset = z.infer<typeof ImageFieldsetSchema>;

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['imageFile']> } {
	return Boolean(image.imageFile?.size && image.imageFile?.size > 0);
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: NonNullable<ImageFieldset['id']> } {
	return !!image.id;
}

const NoteEditorSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, 'Title is required')
		.max(
			TITLE_MAX_LENGTH,
			`Title must be at most ${TITLE_MAX_LENGTH} characters`,
		),
	content: z
		.string()
		.trim()
		.min(1, 'Content is required')
		.max(
			CONTENT_MAX_LENGTH,
			`Content must be at most ${CONTENT_MAX_LENGTH} characters`,
		),
	images: z.array(ImageFieldsetSchema),
});

export const useNote = routeLoader$(async ({ params, error }) => {
	const note = await prisma.note.findFirst({
		where: { id: params.noteId },
		select: {
			title: true,
			content: true,
			images: {
				select: { id: true, altText: true },
			},
		},
	});

	if (!note) {
		throw error(404, 'Note not found');
	}

	return { note };
});

export const useEditNote = routeAction$(
	async ({ title, content, images }, { params, redirect }) => {
		console.log(
			'File',
			images.reduce((acc, current) => acc + (current.imageFile?.size ?? 0), 0),
		);
		console.log({ title, content });
		redirect(302, `/users/${params.username}/notes/${params.noteId}`);
	},
	zod$(NoteEditorSchema),
);

export default component$(() => {
	const data = useNote();
	const editNote = useEditNote();
	const formEl = useSignal<HTMLFormElement>();

	// TODO: Move to hook
	useVisibleTask$(({ track }) => {
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

	console.log(data.value.note.images);

	const imageList = useComputed$<{ id: string; altText?: string | null }[]>(
		() => (data.value.note.images.length ? data.value.note.images : [{}]),
	);

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
				encType='multipart/form-data'
			>
				<button type='submit' class='hidden' />
				<div class='flex flex-col gap-1'>
					<InputField
						labelProps={{ children: 'Title' }}
						inputProps={{
							autoFocus: true,
							id: 'note-title',
							name: 'name',
							value: data.value.note.title,
							required: true,
							maxLength: TITLE_MAX_LENGTH,
							'aria-invalid':
								Boolean(editNote.value?.fieldErrors?.title?.length) ||
								undefined,
							'aria-describedby': editNote.value?.fieldErrors?.title?.length
								? 'title-error'
								: undefined,
						}}
						errors={editNote.value?.fieldErrors?.title}
					/>
					<TextareaField
						labelProps={{ children: 'Content' }}
						textareaProps={{
							id: 'note-content',
							name: 'content',
							value: data.value.note.content,
							required: true,
							maxLength: CONTENT_MAX_LENGTH,
							'aria-invalid':
								Boolean(editNote.value?.fieldErrors?.content?.length) ||
								undefined,
							'aria-describedby': editNote.value?.fieldErrors?.content?.length
								? 'content-error'
								: undefined,
						}}
						errors={editNote.value?.fieldErrors?.content}
					/>
					<div>
						<Label>Images</Label>
						<ul class='flex flex-col gap-4'>
							{imageList.value.map((image, index) => (
								<li
									key={image?.id}
									class='relative border-b-2 border-muted-foreground pb-4'
								>
									<button class='absolute right-0 top-0 text-foreground-destructive'>
										<span aria-hidden>
											<Icon name='cross-1' />
										</span>{' '}
										<span class='sr-only'>Remove image {index + 1}</span>
									</button>
									<ImagePicker
										image={image}
										imageFieldname='imageFile'
										imageIdFieldname='imageId'
										altTextFieldname='altText'
									/>
								</li>
							))}
						</ul>
					</div>
					<Button class='mt-3'>
						<span aria-hidden>
							<Icon name='plus' />
							Image
						</span>{' '}
						<span class='sr-only'>Add image</span>
					</Button>
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
