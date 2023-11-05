import {
	type InputHTMLAttributes,
	type LabelHTMLAttributes,
	component$,
	useId,
} from '@builder.io/qwik';
import { type ListOfErrors } from '@/components/ui/error-list';
import { ErrorList, Input, Label } from '../ui';

interface InputFieldProps {
	labelProps: LabelHTMLAttributes<HTMLLabelElement>;
	inputProps: InputHTMLAttributes<HTMLInputElement>;
	errors?: ListOfErrors;
	class?: string;
}

export default component$<InputFieldProps>(
	({ labelProps, inputProps, errors, class: className }) => {
		const fallbackId = useId();
		const id = inputProps.id ?? fallbackId;
		const errorId = errors?.length ? `${id}-error` : undefined;

		return (
			<div class={className}>
				<Label for={id} {...labelProps} />
				<Input
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					{...inputProps}
				/>
				<div class='min-h-[32px] px-4 pb-3 pt-1'>
					{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
				</div>
			</div>
		);
	},
);
