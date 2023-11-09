import {
	component$,
	type InputHTMLAttributes,
	type JSXChildren,
} from '@builder.io/qwik';

interface InputFormProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> {
	error: string;
	label: JSXChildren;
}

export default component$<InputFormProps>(
	({ error, label, class: className, ...props }) => {
		return (
			<div class={className}>
				<label>{label}</label>
				<input class='border border-black' {...props} />
				{error && <div class='text-red-600'>{error}</div>}
			</div>
		);
	},
);
