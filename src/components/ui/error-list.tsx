import { component$ } from '@builder.io/qwik';

interface ErrorListProps {
	id?: string;
	errors?: string[] | null;
}

export default component$<ErrorListProps>(({ id, errors }) => {
	return errors?.length ? (
		<ul id={id} class='flex flex-col gap-1'>
			{errors.map((error, i) => (
				<li key={i} class='text-[10px] text-foreground-destructive'>
					{error}
				</li>
			))}
		</ul>
	) : null;
});
