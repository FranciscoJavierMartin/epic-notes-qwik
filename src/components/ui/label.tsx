import { cn } from '@/utils/misc';
import { type LabelHTMLAttributes, Slot, component$ } from '@builder.io/qwik';
import { cva } from 'class-variance-authority';

const labelVariants = cva(
	'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export default component$<LabelProps>(({ class: className, ...props }) => {
	return (
		<label class={cn(labelVariants(), className)} {...props}>
			<Slot />
		</label>
	);
});
