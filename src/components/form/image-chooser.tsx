import { component$ } from '@builder.io/qwik';
import { TextareaField } from '../fields';
import { Field } from '@modular-forms/qwik';

interface ImageChooserProps {
	altTextFieldName: string;
}

export default function ImageChooser({ altTextFieldName }: ImageChooserProps) {
	return (
		<fieldset >
			<div class='flex gap-3'>
				<div class='flex-1'>
					<Field name={altTextFieldName}>
						{(field, props) => (
							<TextareaField
								labelProps={{ children: 'Alt text' }}
								error={''}
								{...props}
								value={field.value}
							/>
						)}
					</Field>
				</div>
			</div>
		</fieldset>
	);
}
