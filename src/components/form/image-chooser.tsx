import { component$, useSignal } from '@builder.io/qwik';
import { Icon } from '../ui';
import { cn, getNoteImgSrc } from '@/utils/misc';

interface ImageChooserProps {
	name: string;
	imageId?: string;
	altText?: string;
}

export default component$<ImageChooserProps>(({ name, imageId, altText }) => {
	const existingImage: boolean = Boolean(imageId);
	const previewImage = useSignal<string | null>(
		existingImage ? getNoteImgSrc(imageId!) : null,
	);

	return (
		<div class='w-32'>
			<div class='relative h-32 w-32'>
				<label
					for={imageId}
					class={cn('group absolute h-32 w-32 rounded-lg', {
						'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
							!previewImage.value,
						'cursor-pointer focus-within:ring-4': !existingImage,
					})}
				>
					{previewImage.value ? (
						<div class='relative'>
							<img
								src={previewImage.value}
								alt={altText ?? ''}
								class='h-32 w-32 rounded-lg object-cover'
								width={128}
								height={128}
							/>
							{existingImage ? null : (
								<div class='pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md'>
									new
								</div>
							)}
						</div>
					) : (
						<div class='flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground'>
							<Icon name='plus' />
						</div>
					)}
					<input
						aria-label='Image'
						accept='image/*'
						class='absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0'
						name={name}
						type='file'
						onChange$={(event) => {
							const file = event.target.files?.[0];

							if (file) {
								const reader = new FileReader();

								reader.onloadend = () => {
									previewImage.value = reader.result as string;
								};

								reader.readAsDataURL(file);
							} else {
								previewImage.value = null;
							}
						}}
					/>
				</label>
			</div>
		</div>
	);
});
