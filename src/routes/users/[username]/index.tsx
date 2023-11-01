import { component$ } from '@builder.io/qwik';
import {
	type DocumentHead,
	Link,
	routeLoader$,
	useLocation,
} from '@builder.io/qwik-city';

export const useUserProfile = routeLoader$(async ({ params }) => {
	const user = {
		id: '9d6eba59daa2fc2078cf8205cd451041',
		email: 'kody@kcd.dev',
		username: 'kody',
		name: 'Kody',
		createdAt: new Date('2023-10-30T22:27:04.762Z'),
	};

	return { user };
});

export default component$(() => {
	const location = useLocation();
	const data = useUserProfile();

	return (
		<div class='container mb-48 mt-36'>
			<h1 class='text-h1'>
				{data.value.user.name ?? data.value.user.username}
			</h1>
			<Link
				href={`/users/${location.params.username}/notes`}
				class='underline'
				prefetch
			>
				Notes
			</Link>
		</div>
	);
});

export const head: DocumentHead = () => {
	return {
		title: 'Profile | Epic Notes',
		meta: [
			{ name: 'description', content: 'Checkout this profile on Epic Notes' },
		],
	};
};
