import InputForm from '@/components/form/input-form';
import { prisma } from '@/db/db.server';
import { $, component$ } from '@builder.io/qwik';
import { routeLoader$, z } from '@builder.io/qwik-city';
import {
	useForm,
	type InitialValues,
	type SubmitHandler,
	formAction$,
	zodForm$,
} from '@modular-forms/qwik';

const LoginSchemaZod = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Email is required')
		.email(`Email bad formatted`),
	password: z.string().trim().min(1, 'Password is required'),
});

type LoginForm = typeof LoginSchemaZod._type;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(
	async ({ params, error }) => {
		const user = await prisma.user.findFirst({
			select: {
				email: true,
			},
			where: {
				username: 'kody',
			},
		});

		return {
			email: user?.email ?? '',
			password: '',
		};
	},
);

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
					<InputForm
						value={field.value}
						error={field.error}
						placeholder='Email'
						{...props}
					/>
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
