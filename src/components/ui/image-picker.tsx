import { component$ } from '@builder.io/qwik';

interface ImagePickerProps {
	image?: { id: string; altText?: string | null };
}

export default component$<ImagePickerProps>(() => {
	return (
		<fieldset>
			<input id='image-input' name='file' type='file' />
		</fieldset>
	);
});
