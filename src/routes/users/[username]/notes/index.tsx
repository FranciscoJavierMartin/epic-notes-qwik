import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { useOwnerNotes } from './layout';

export const head: DocumentHead = ({ resolveValue, params }) => {
	const data = resolveValue(useOwnerNotes);

	const displayName = data.owner.name ?? params.username;
	const noteCount = data.owner.notes.length ?? 0;
	const notesText = noteCount === 1 ? 'note' : 'notes';

	return {
		title: `${displayName}'s Notes | Epic Notes`,
		meta: [
			{
				name: 'description',
				content: `Checkout ${displayName}'s ${noteCount} ${notesText} on Epic Notes`,
			},
		],
	};
};

export default component$(() => {
	return (
		<div class='container pt-12'>
			<p class='text-body-md'>Select a note</p>
		</div>
	);
});
