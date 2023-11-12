import {
	component$,
	type TextareaHTMLAttributes,
	type LabelHTMLAttributes,
	useId,
} from '@builder.io/qwik';
import { ErrorList, Label, Textarea } from '@/components/ui';

interface TextareaFieldProps
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
	error: string;
	labelProps: LabelHTMLAttributes<HTMLLabelElement>;
}

export default component$<TextareaFieldProps>(
	({ labelProps, error, class: className, ...props }) => {
		const fallbackId = useId();
		const id = props.id ?? fallbackId;
		const errorId = error ? `${id}-error` : undefined;

		return (
			<div class={className}>
				<Label for={id} {...labelProps} />
				<Textarea
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					{...props}
				/>
				<div class='min-h-[32px] px-4 pb-3 pt-1'>
					{errorId && <ErrorList id={errorId} errors={[error]} />}
				</div>
			</div>
		);
	},
);
