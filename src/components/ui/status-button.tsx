import { Slot, component$ } from '@builder.io/qwik';
import Button, { type ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/misc';

interface StatusButtonProps extends ButtonProps {
	status: 'pending' | 'success' | 'error' | 'idle';
}

export default component$<StatusButtonProps>(
	({ status, class: className, ...props }) => {
		const companion = {
			pending: <span class='inline-block animate-spin'>🌀</span>,
			success: <span>✅</span>,
			error: <span>❌</span>,
			idle: null,
		}[status];

		return (
			<Button class={cn('flex justify-center gap-4', className)} {...props}>
				<div>
					<Slot />
				</div>
				{companion}
			</Button>
		);
	},
);
