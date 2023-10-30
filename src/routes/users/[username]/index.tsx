import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
	const location = useLocation();

	return (
		<>
			<h1>Hello {location.params.username}</h1>
			<Link href={`/users/${location.params.username}/notes`}>Notes</Link>
		</>
	);
});
