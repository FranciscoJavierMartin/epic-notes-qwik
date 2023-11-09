import {
	component$,
	useId,
	type InputHTMLAttributes,
	type JSXChildren,
} from '@builder.io/qwik';
import { ErrorList, Input, Label } from '@/components/ui';

interface InputFormProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> {
	error: string;
	label: JSXChildren;
}

export default component$<InputFormProps>(
	({ error, label, class: className, ...props }) => {
		const fallbackId = useId();
		const id = props.id ?? fallbackId;
		const errorId = error ? `${id}-error` : undefined;

		return (
			<div class={className}>
				<Label for={id}>{label}</Label>
				<Input
					{...props}
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
				/>
				<div class='min-h-[32px] px-4 pb-3 pt-1'>
					{errorId && <ErrorList id={errorId} errors={[error]} />}
				</div>
			</div>
		);
	},
);
