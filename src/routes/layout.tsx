import { component$, Slot } from '@builder.io/qwik';
import {
	type DocumentHead,
	Link,
	type DocumentMeta,
} from '@builder.io/qwik-city';

export default component$(() => {
	return (
		<>
			<header class='container mx-auto py-6'>
				<nav class='flex justify-between'>
					<Link href='/'>
						<div class='font-light'>epic</div>
						<div class='font-bold'>notes</div>
					</Link>
				</nav>
			</header>
			<div class='flex-1'>
				<Slot />
			</div>
			<div class='container mx-auto flex justify-between'>
				<Link href='/'>
					<div class='font-light'>epic</div>
					<div class='font-bold'>notes</div>
				</Link>
				<p>Built with ♥️ by John Doe</p>
			</div>
			<dic class='h-5' />
		</>
	);
});

export const head: DocumentHead = ({ head }) => {
	const meta = new Map<string, DocumentMeta>();

	meta.set('description', {
		name: 'description',
		content: "Your own captain's log",
	});

	head.meta.forEach((metaTag) => {
		meta.delete(metaTag.name ?? '');
	});

	return {
		title: head.title || 'Epic Notes',
		meta: [...meta.values()],
	};
};
