import { type NoSerialize, component$ } from '@builder.io/qwik';
import { formAction$, useForm, valiForm$ } from '@modular-forms/qwik';
import { type Input, object, special } from 'valibot';

const UploadSchema = object({
	imageFile: special<NoSerialize<Blob>>((input) => input instanceof Blob),
});

type UploadForm = Input<typeof UploadSchema>;

export const useFormAction = formAction$<UploadForm>(
	async (values) => {
		console.log(values);
	},
	{
		validate: valiForm$(UploadSchema),
		files: ['imageFile'],
	},
);

export default component$(() => {
	const [, { Form, Field }] = useForm({
		loader: { value: { imageFile: undefined } },
		action: useFormAction(),
		validate: valiForm$(UploadSchema),
	});

	return (
		<div>
			<Form encType='multipart/form-data' class='flex flex-col'>
				<Field name='imageFile' type='File'>
					{(field, props) => <input type='file' {...props} />}
				</Field>
				<button type='submit' class='bg-blue-500 text-white'>
					Submit
				</button>
			</Form>
		</div>
	);
});
