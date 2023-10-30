import { db } from '@/db/db.server';
import { Slot, component$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation } from '@builder.io/qwik-city';

export const useOwnerNotes = routeLoader$(async ({ params, error }) => {
	// const owner = db.user.findFirst({
	// 	where: {
	// 		username: {
	// 			equals: params.username,
	// 		},
	// 	},
	// });

	// if (!owner) {
	// 	throw error(404, 'Owner not found');
	// }

	// const notes = db.note
	// 	.findMany({
	// 		where: {
	// 			owner: {
	// 				username: {
	// 					equals: params.username,
	// 				},
	// 			},
	// 		},
	// 	})
	// 	.map(({ id, title }) => ({ id, title }));

	const owner = {
		id: '9d6eba59daa2fc2078cf8205cd451041',
		email: 'kody@kcd.dev',
		username: 'kody',
		name: 'Kody',
		createdAt: new Date('2023-10-30T22:27:04.762Z'),
	};

	const notes = [
		{ id: 'd27a197e', title: 'Basic Koala Facts' },
		{ id: '414f0c09', title: 'Koalas like to cuddle' },
		{ id: '260366b1', title: 'Not bears' },
		{ id: 'bb79cf45', title: 'Snowboarding Adventure' },
		{ id: '9f4308be', title: 'Onewheel Tricks' },
		{ id: '306021fb', title: 'Coding Dilemma' },
		{ id: '16d4912a', title: 'Coding Mentorship' },
		{ id: '3199199e', title: 'Koala Fun Facts' },
		{ id: '2030ffd3', title: 'Skiing Adventure' },
		{ id: 'f375a804', title: 'Code Jam Success' },
		{ id: '562c541b', title: 'Koala Conservation Efforts' },
		{ id: 'f67ca40b', title: 'Game day' },
	];

	return { owner, notes };
});

export default component$(() => {
	const location = useLocation();
	const data = useOwnerNotes();

	return (
		<>
			<h1>{location.params.username} Notes</h1>
			<Link href={`/users/${location.params.username}`}>Back to user</Link>
			<ul>
				{data.value.notes.map((note) => (
					<li key={note.id}>
						<Link href={`/users/${location.params.username}/notes/${note.id}`}>
							{note.title}
						</Link>
					</li>
				))}
			</ul>
			<Slot />
		</>
	);
});
