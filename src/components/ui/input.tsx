import { cn } from '@/utils/misc';
import { type InputHTMLAttributes, component$ } from '@builder.io/qwik';

interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> {}

export default component$<InputProps>(({ class: className, ...props }) => {
	return (
		<input
			class={cn(
				'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring aria-[invalid]:border-input-invalid flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	);
});
