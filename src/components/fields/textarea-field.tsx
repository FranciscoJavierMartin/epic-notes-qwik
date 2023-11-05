import {
	type LabelHTMLAttributes,
	type TextareaHTMLAttributes,
	component$,
	useId,
} from '@builder.io/qwik';
import type { ListOfErrors } from '../ui/error-list';
import { ErrorList, Label, Textarea } from '../ui';

interface TextareaFieldProps {
	labelProps: LabelHTMLAttributes<HTMLLabelElement>;
	textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
	errors?: ListOfErrors;
	class?: string;
}

export default component$<TextareaFieldProps>(
	({ labelProps, textareaProps, errors, class: className }) => {
		const fallbackId = useId();
		const id = textareaProps.id ?? fallbackId;
		const errorId = errors?.length ? `${id}-error` : undefined;

		return (
			<div class={className}>
				<Label for={id} {...labelProps} />
				<Textarea
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					{...textareaProps}
				/>
				<div class='min-h-[32px] px-4 pb-3 pt-1'>
					{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
				</div>
			</div>
		);
	},
);
