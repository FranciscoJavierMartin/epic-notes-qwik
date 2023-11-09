import { $, component$ } from '@builder.io/qwik';
import { routeLoader$, z, zod$ } from '@builder.io/qwik-city';
import {
	useForm,
	type InitialValues,
	type SubmitHandler,
	valiForm$,
	formAction$,
	zodForm$,
} from '@modular-forms/qwik';
import { type Input, email, minLength, object, string } from 'valibot';

const LoginSchema = object({
	email: string([
		minLength(1, 'Please enter your email'),
		email('Email address is badly formatted'),
	]),
	password: string([
		minLength(1, 'Please enter your password'),
		minLength(4, 'Your password must have 4 characters or more'),
	]),
});

const LoginSchemaZod = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Email is required')
		.email(`Email bad formatted`),
	password: z.string().trim().min(1, 'Password is required'),
});

type LoginForm = Input<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
	email: '',
	password: '',
}));

export const useFormAction = formAction$<LoginForm>((values) => {
	console.log(values);
}, zodForm$(LoginSchemaZod));

export default component$(() => {
	const [loginForm, { Form, Field, FieldArray }] = useForm<LoginForm>({
		loader: useFormLoader(),
		action: useFormAction(),
		validate: zodForm$(LoginSchemaZod),
	});

	const handleSubmit = $<SubmitHandler<LoginForm>>((values, event) => {
		// console.log(values);
	});

	return (
		<Form class='flex w-52 flex-col' onSubmit$={handleSubmit}>
			<Field name='email'>
				{(field, props) => (
					<div class='flex flex-col'>
						<input
							{...props}
							type='email'
							value={field.value}
							placeholder='Email'
							class='border border-black'
						/>
						{field.error && <div class='text-red-600'>{field.error}</div>}
					</div>
				)}
			</Field>
			<Field name='password'>
				{(field, props) => (
					<div class='flex flex-col'>
						<input
							{...props}
							type='password'
							value={field.value}
							placeholder='Password'
							class='border border-black '
						/>
						{field.error && <div class='text-red-600'>{field.error}</div>}
					</div>
				)}
			</Field>
			<button type='submit' class='bg-blue-600 text-white'>
				Login
			</button>
		</Form>
	);
});
