import { Button, Input, Label } from '@/components/ui';
import { component$ } from '@builder.io/qwik';
import {
	Form,
	type DocumentHead,
	routeAction$,
	zod$,
	z,
} from '@builder.io/qwik-city';

export const head: DocumentHead = () => {
	return {
		title: 'Setup Epic Notes Account',
	};
};

export const useSignup = routeAction$(
	({ name, email }, { redirect }) => {
		if (name) {
			throw new Response('Form not submitted properly', { status: 400 });
		}

		redirect(302, '/');
	},
	zod$({
		email: z.string().email(),
		name: z.string().optional(),
	}),
);

export default component$(() => {
	const signup = useSignup();

	return (
		<div class='container flex min-h-full flex-col justify-center pb-32 pt-20'>
			<div class='mx-auto w-full max-w-lg'>
				<div class='flex flex-col gap-3 text-center'>
					<h1 class='text-h1'>Welcome aboard!</h1>
					<p class='text-body-md text-muted-foreground'>
						Please enter your details
					</p>
				</div>
				<Form
					action={signup}
					class='mx-auto flex min-w-[368px] max-w-sm flex-col gap-4'
				>
					<div class='hidden' aria-hidden>
						<label for='name-input'>Please leave this field blank</label>
						<input id='name-input' name='name' type='text' />
					</div>
					<div>
						<Label for='email-input'>Email</Label>
						<Input
							autoFocus
							id='email-input'
							name='email'
							type='email'
							placeholder='Email'
						/>
					</div>
					<Button type='submit' class='w-full'>
						Create account
					</Button>
				</Form>
			</div>
		</div>
	);
});
