import { cn } from '@/utils/misc';
import { type TextareaHTMLAttributes, component$ } from '@builder.io/qwik';

interface TextareaProps
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {}

export default component$<TextareaProps>(({ class: className, ...props }) => {
	return (
		<textarea
			class={cn(
				'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring aria-[invalid]:border-input-invalid flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	);
});
