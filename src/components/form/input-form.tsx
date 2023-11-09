import { type InputHTMLAttributes, component$ } from '@builder.io/qwik';

interface InputFormProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> {
	error: string;
}

export default component$<InputFormProps>(({ error, ...props }) => {
	return (
		<div class='flex flex-col'>
			<input class='border border-black' {...props} />
			{error && <div class='text-red-600'>{error}</div>}
		</div>
	);
});
