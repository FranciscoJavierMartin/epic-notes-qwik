import { type QwikChangeEvent, component$, useSignal } from '@builder.io/qwik';
import { ErrorList, Icon, Label, Textarea } from './';
import { cn } from '@/utils/misc';

interface ImagePickerProps {
	image?: { id: string; altText?: string | null };
	altTextFieldname: string;
	imageFieldname: string;
	imageIdFieldname: string;
}

// TODO: Add errors id
export default component$<ImagePickerProps>(
	({ image, altTextFieldname, imageFieldname, imageIdFieldname }) => {
		const existingImage = Boolean(image);
		const previewImage = useSignal<string | null>(
			existingImage ? `/api/images/${image?.id}` : null,
		);
		const altText = useSignal<string>(image?.altText ?? '');

		return (
			<fieldset>
				<div class='flex gap-3'>
					<div class='w-32'>
						<div class='relative h-32 w-32'>
							<label
								for='image-input'
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
											alt={altText.value ?? ''}
											width={128}
											height={128}
											class='h-32 w-32 rounded-lg object-cover'
										/>
										{!existingImage && (
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
								{existingImage ? (
									<input
										name={imageIdFieldname}
										type='hidden'
										value={image?.id}
									/>
								) : null}
								<input
									id='image-input'
									name={imageFieldname}
									type='file'
									accept='image/*'
									aria-label='Image'
									class='absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0'
									onChange$={(event: QwikChangeEvent<HTMLInputElement>) => {
										const file: File | undefined = event.target.files?.[0];

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
						<div class='min-h-[32px] px-4 pb-3 pt-1'>
							<ErrorList id='' errors={[]} />
						</div>
					</div>
					<div class='flex-1'>
						<Label for='alt-text'>Alt Text</Label>
						<Textarea
							id='alt-text'
							name={altTextFieldname}
							bind:value={altText}
						/>
						<div class='min-h-[32px] px-4 pb-3 pt-1'>
							<ErrorList id='' errors={[]} />
						</div>
					</div>
				</div>
				<div class='min-h-[32px] px-4 pb-3 pt-1'>
					<ErrorList id='' errors={[]} />
				</div>
			</fieldset>
		);
	},
);
