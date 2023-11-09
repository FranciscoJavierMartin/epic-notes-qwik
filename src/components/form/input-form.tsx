import { type InputHTMLAttributes, component$ } from '@builder.io/qwik';

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
	error: string;
}

export default component$<InputFormProps>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ error, value, children, ...props }) => {
		return (
			<div class='flex flex-col'>
				<input
					{...props}
					type='email'
					value={value}
					placeholder='Email'
					class='border border-black'
				/>
				{error && <div class='text-red-600'>{error}</div>}
			</div>
		);
	},
);
