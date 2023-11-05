import { useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface SpinDelayOptions {
	delay?: number;
	minDuration?: number;
}

type State = 'IDLE' | 'DELAY' | 'DISPLAY' | 'EXPIRE';

const defaultOptions: SpinDelayOptions = {
	delay: 500,
	minDuration: 200,
};

export default function useSpinDelay(
	loading: boolean,
	spinDelayOptions?: SpinDelayOptions,
) {
	const options: SpinDelayOptions = Object.assign(
		{},
		defaultOptions,
		spinDelayOptions,
	);
	const state = useSignal<State>('IDLE');
	const timeout = useSignal<any>();

	useVisibleTask$(({ track }) => {
		track(() => [loading, state, options.delay, options.minDuration]);

		if (loading && state.value === 'IDLE') {
			clearTimeout(timeout.value);

			timeout.value = setTimeout(() => {
				if (!loading) {
					state.value = 'IDLE';
					return;
				}

				timeout.value = setTimeout(() => {
					state.value = 'EXPIRE';
				}, options.minDuration);

				state.value = 'DISPLAY';
			}, options.delay);

			state.value = 'DELAY';
		}

		if (!loading && state.value !== 'DISPLAY') {
			clearTimeout(timeout.value);
			state.value = 'IDLE';
		}
	});

	useVisibleTask$(({ cleanup }) => {
		cleanup(() => {
			clearTimeout(timeout.value);
		});
	});

	return state.value === 'DISPLAY' || state.value === 'EXPIRE';
}
