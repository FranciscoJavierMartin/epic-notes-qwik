import { Slot, component$ } from '@builder.io/qwik';
import Button, { type ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/misc';
import { Icon } from './icon';

interface StatusButtonProps extends ButtonProps {
	status: 'pending' | 'success' | 'error' | 'idle';
	message?: string | null;
}

export default component$<StatusButtonProps>(
	({ status, class: className, ...props }) => {
		const companion = {
			pending: true ? (
				<div class='inline-flex h-6 w-6 items-center justify-center'>
					<Icon name='update' class='animate-spin' />
				</div>
			) : null,
			success: (
				<div class='inline-flex h-6 w-6 items-center justify-center'>
					<Icon name='check' />
				</div>
			),
			error: (
				<div class='inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive'>
					<Icon name='cross-1' class='text-destructive-foreground' />
				</div>
			),
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
