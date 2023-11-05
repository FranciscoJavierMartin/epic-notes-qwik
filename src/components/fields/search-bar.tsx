import { $, component$, useId } from '@builder.io/qwik';
import type { Status } from '@/types';
import { Form } from '@builder.io/qwik-city';
import { Icon, Input, Label, StatusButton } from '../ui';

interface SearchBarProps {
	status: Status;
	autoFocus?: boolean;
	autoSubmit?: boolean;
}

export default component$<SearchBarProps>(
	({ status, autoFocus = false, autoSubmit = false }) => {
		const id = useId();

		const handleSubmit = $(() => {});

		return (
			<Form
				class='flex flex-wrap items-center justify-center gap-2'
				onSubmit$={handleSubmit}
			>
				<div class='flex-1'>
					<Label for={id} class='sr-only'>
						Search
					</Label>
					<Input
						type='search'
						name='search'
						id={id}
						value={''}
						placeholder='Search'
						class='w-full'
						autoFocus={autoFocus}
					/>
				</div>
				<div>
					<StatusButton
						type='submit'
						status={'idle'}
						class='flex w-full items-center justify-center'
						size='sm'
					>
						<Icon name='magnifying-glass' size='sm' />
						<span class='sr-only'>Search</span>
					</StatusButton>
				</div>
			</Form>
		);
	},
);
