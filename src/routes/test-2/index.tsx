import { type NoSerialize, component$ } from '@builder.io/qwik';
import { formAction$, useForm, valiForm$ } from '@modular-forms/qwik';
import { type Input, object, special, array } from 'valibot';

const UploadSchema = object({
	imageFiles: array(
		special<NoSerialize<Blob>>((input) => input instanceof Blob),
	),
});

type UploadForm = Input<typeof UploadSchema>;

export const useFormAction = formAction$<UploadForm>(
	async (values) => {
		console.log(values);
	},
	{
		validate: valiForm$(UploadSchema),
		files: ['imageFiles'],
	},
);

export default component$(() => {
	const [, { Form, Field, FieldArray }] = useForm({
		loader: { value: { imageFiles: [] } },
		action: useFormAction(),
		validate: valiForm$(UploadSchema),
	});

	return (
		<div>
			{/* <Form encType='multipart/form-data' class='flex flex-col'>
				<FieldArray name='imageFiles'>
					{(imageList) => (
						<Field name='imageFiles' type='File[]'>
							{(field, props) => <input type='file' {...props} />}
						</Field>
					)}
				</FieldArray>
				<button type='submit' class='bg-blue-500 text-white'>
					Submit
				</button>
			</Form> */}
		</div>
	);
});
