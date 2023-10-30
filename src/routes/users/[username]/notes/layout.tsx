import { Slot, component$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation } from '@builder.io/qwik-city';

export const useOwnerNotes = routeLoader$(async ({ params }) => {
	return {
		links: [1, 2, 3, 4, 5],
	};
});

export default component$(() => {
	const location = useLocation();
	const data = useOwnerNotes();

	return (
		<>
			<h1>{location.params.username} Notes</h1>
			<Link href={`/users/${location.params.username}`}>Back to user</Link>
			<ul>
				{data.value.links.map((link) => (
					<li key={link}>
						<Link href={`/users/${location.params.username}/notes/${link}`}>
							{link}
						</Link>
					</li>
				))}
			</ul>
			<Slot />
		</>
	);
});
