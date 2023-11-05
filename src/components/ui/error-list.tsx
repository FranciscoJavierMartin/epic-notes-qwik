import { component$ } from '@builder.io/qwik';

type ListOfErrors = Array<string | null | undefined> | null | undefined;

interface ErrorListProps {
	id?: string;
	errors?: ListOfErrors;
}

export default component$<ErrorListProps>(({ id, errors }) => {
	const errorsToRender = errors?.filter(Boolean);

	return errorsToRender?.length ? (
		<ul id={id} class='flex flex-col gap-1'>
			{errorsToRender.map((error) => (
				<li key={error} class='text-[10px] text-foreground-destructive'>
					{error}
				</li>
			))}
		</ul>
	) : null;
});
