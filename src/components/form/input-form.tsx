import { type InputHTMLAttributes, component$ } from '@builder.io/qwik';

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
	error: string;
}

export default component$<InputFormProps>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ error, children, ...props }) => {
		return (
			<div class='flex flex-col'>
				<input class='border border-black' {...props} />
				{error && <div class='text-red-600'>{error}</div>}
			</div>
		);
	},
);
