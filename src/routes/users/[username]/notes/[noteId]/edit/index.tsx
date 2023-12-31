import { $, component$ } from '@builder.io/qwik';
import { routeLoader$, z } from '@builder.io/qwik-city';
import {
	useForm,
	type InitialValues,
	type SubmitHandler,
	formAction$,
	zodForm$,
	remove,
	insert,
} from '@modular-forms/qwik';
import { createId as cuid } from '@paralleldrive/cuid2';
import { Button, Icon, Label, StatusButton } from '@/components/ui';
import { InputField, TextareaField } from '@/components/fields';
import ImagePicker from '@/components/ui/image-picker';
import { prisma } from '@/db/db.server';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;
const CONTENT_MIN_LENGTH = 1;
const CONTENT_MAX_LENGTH = 10_000;

const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	imageFile: z
		.any()
		.refine((file) => file.size <= MAX_UPLOAD_SIZE)
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
type ImageFieldset = typeof ImageFieldsetSchema._type;

function hasImageFile(image: ImageFieldset): boolean {
	return Boolean(image.imageFile?.size && image.imageFile?.size > 0);
}

function hasImageId(image: ImageFieldset): boolean {
	return Boolean(image.id);
}

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
				id: params.noteId,
			},
		});

		if (!note) {
			throw error(404, 'Note not found');
		}

		return note as any;
	},
);

export const useFormAction = formAction$<EditNoteForm>(
	async ({ title, content, images = [] }, { params, error, redirect }) => {
		const { noteId } = params;

		if (!noteId) {
			throw error(400, 'noteId is required');
		}

		// TODO: Handle error when images list size is greater than 5 or the images are large than 3Mb.

		const imagesToUpdate = await Promise.all(
			images.filter(hasImageId).map(async (image) =>
				hasImageFile(image)
					? {
							id: image.id!,
							altText: image.altText,
							contentType: image.imageFile.type,
							blob: Buffer.from(await image.imageFile.arrayBuffer()),
					  }
					: {
							id: image.id!,
							altText: image.altText,
					  },
			),
		);

		const newImages = await Promise.all(
			images
				.filter(hasImageFile)
				.filter((image) => !hasImageId(image))
				.map(async (image) => ({
					altText: image.altText,
					contentType: image.imageFile.type,
					blob: Buffer.from(await image.imageFile.arrayBuffer()),
				})),
		);

		await prisma.note.update({
			select: { id: true },
			where: { id: params.noteId },
			data: {
				title,
				content,
				images: {
					deleteMany: {
						id: {
							notIn: imagesToUpdate.map((image) => image.id),
						},
					},
					updateMany: imagesToUpdate.map((image) => ({
						where: { id: image.id },
						data: {
							...image,
							id: image.blob ? cuid() : image.id,
						},
					})),
					create: newImages,
				},
			},
		});

		redirect(302, `/users/${params.username}/notes/${noteId}`);
	},
	{
		validate: zodForm$(NoteEditorSchema),
		files: ['images.$.imageFile'],
		arrays: ['images'],
	},
);

export default component$(() => {
	const [editNoteForm, { Form, Field, FieldArray }] = useForm<EditNoteForm>({
		loader: useFormLoader(),
		action: useFormAction(),
		validate: zodForm$(NoteEditorSchema),
		fieldArrays: ['images'],
	});

	const handleSubmit = $<SubmitHandler<EditNoteForm>>(() => {});

	return (
		<div>
			<Form
				id='note-editor'
				onSubmit$={handleSubmit}
				class='flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pt-12'
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
					<FieldArray name='images'>
						{(imageList) => (
							<div>
								<Label>Images</Label>
								<ul class='flex flex-col gap-4'>
									{imageList.items.map((image, index) => (
										<li
											key={image}
											class='relative border-b-2 border-muted-foreground pb-4'
										>
											{/* TODO: Avoid submit form when click on remove */}
											<button
												class='absolute right-0 top-0 text-foreground-destructive'
												onClick$={$(() =>
													remove(editNoteForm, 'images', { at: index }),
												)}
											>
												<span aria-hidden>
													<Icon name='cross-1' />
												</span>{' '}
												<span class='sr-only'>Remove image {index + 1}</span>
											</button>
											<fieldset>
												<div class='flex gap-3'>
													<Field name={`images.${index}.id`}>
														{(field, props) => (
															<>
																<input
																	{...props}
																	type='hidden'
																	value={field.value}
																/>
																<ImagePicker
																	name={`images.${index}.imageFile`}
																	imageId={field.value}
																/>
															</>
														)}
													</Field>
													<Field name={`images.${index}.altText`}>
														{(field, props) => (
															<div class='flex-1'>
																<TextareaField
																	{...props}
																	labelProps={{ children: 'Alt text' }}
																	error={field.error}
																	value={field.value}
																/>
															</div>
														)}
													</Field>
												</div>
											</fieldset>
										</li>
									))}
								</ul>
							</div>
						)}
					</FieldArray>
				</div>
			</Form>
			<div class='w-full px-10 pb-28'>
				{/* TODO: Avoid submit form when click on add. Fixed for now but the button should be inside form */}
				<Button
					class='mt-3 w-full'
					onClick$={$(() => {
						insert(editNoteForm, 'images', {
							value: { altText: '', id: undefined, imageFile: undefined },
						});
					})}
				>
					<span aria-hidden class='flex gap-1'>
						<Icon name='plus' /> Image
					</span>{' '}
					<span class='sr-only'>Add image</span>
				</Button>
			</div>
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
