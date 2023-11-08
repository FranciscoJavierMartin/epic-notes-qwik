import { component$ } from '@builder.io/qwik';
import {
	Form,
	type DocumentHead,
	routeAction$,
	zod$,
	z,
} from '@builder.io/qwik-city';
import { Button, HoneypotInput, Input, Label } from '@/components/ui';
import { checkHoneypot } from '@/utils/misc';

export const head: DocumentHead = () => {
	return {
		title: 'Setup Epic Notes Account',
	};
};

export const useSignup = routeAction$(
	({ name, email }, { redirect }) => {
		checkHoneypot(name);
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
					<HoneypotInput fieldName='name' />
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
