import { component$, useErrorBoundary } from '@builder.io/qwik';

export default component$(() => {
	const error = useErrorBoundary();
	console.log(error);

	return (
		<div class='bg-destructive text-h2 text-destructive-foreground container mx-auto flex h-full w-full items-center justify-center p-20'>
			<p>Oh no, something went wrong. Sorry about that.</p>
		</div>
	);
});
