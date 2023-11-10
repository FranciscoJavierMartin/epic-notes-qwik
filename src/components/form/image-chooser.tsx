import { component$, useSignal } from '@builder.io/qwik';
import { Field, FieldElementProps, FieldStore } from '@modular-forms/qwik';
import { ErrorList, Icon } from '../ui';
import { cn, getNoteImgSrc } from '@/utils/misc';

interface ImageChooserProps {
	index: number;
	field: FieldStore<
		{
			title: string;
			content: string;
			images?:
				| {
						id?: string | undefined;
						imageFile?: any;
						altText?: string | undefined;
				  }[]
				| undefined;
		},
		`images.${number}.id`
	>;
	props: FieldElementProps<
		{
			title: string;
			content: string;
			images?:
				| {
						id?: string | undefined;
						imageFile?: any;
						altText?: string | undefined;
				  }[]
				| undefined;
		},
		`images.${number}.id`
	>;
}

export default component$<ImageChooserProps>(({ index, field, props }) => {
	const existingImage: boolean = true;
	const previewImage = useSignal<string | null>(
		field.value ? getNoteImgSrc(field.value) : null,
	);

	return (
		<div class='w-32'>
			<div class='relative h-32 w-32'>
				<label
					for={`images.${index}.id`}
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
								alt=''
								class='h-32 w-32 rounded-lg object-cover'
								width={128}
								height={128}
							/>
						</div>
					) : (
						<div class='flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground'>
							<Icon name='plus' />
						</div>
					)}
					{existingImage ? (
						<input
							{...props}
							type='hidden'
							name={`images.${index}.id`}
							value={field.value}
						/>
					) : null}
					{/* Try first to convert to text to check that is properly catch  */}
					{/* <input
					aria-label='Image'
					accept='image/*'
					class='absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0'
					type='file'
					name={`images.${index}.imageFile`}
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
				/> */}
					<input
						aria-label='Image'
						accept='image/*'
						name={`images.${index}$.imageFile`}
						type='file'
					/>
				</label>
			</div>
			<div class='min-h-[32px] px-4 pb-3 pt-1'>
				<ErrorList id={field.value} errors={[field.error]} />
			</div>
		</div>
	);
});
