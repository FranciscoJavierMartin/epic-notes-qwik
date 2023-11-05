import type { SVGProps } from '@builder.io/qwik';
import href from './icon.svg';
import { cn } from '@/utils/misc';

const sizeClassName = {
	font: 'w-[1em] h-[1em]',
	xs: 'w-3 h-3',
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
	xl: 'w-7 h-7',
} as const;

type Size = keyof typeof sizeClassName;

const childrenSizeClassName = {
	font: 'gap-1',
	xs: 'gap-1',
	sm: 'gap-1',
	md: 'gap-2',
	lg: 'gap-2',
	xl: 'gap-3',
} satisfies Record<Size, string>;

export type IconName =
	| 'arrow-left'
	| 'arrow-right'
	| 'avatar'
	| 'camera'
	| 'check'
	| 'clock'
	| 'cross-1'
	| 'exit'
	| 'file-text'
	| 'laptop'
	| 'lock-closed'
	| 'lock-open-1'
	| 'magnifying-glass'
	| 'moon'
	| 'pencil-1'
	| 'pencil-2'
	| 'plus'
	| 'reset'
	| 'sun'
	| 'trash'
	| 'update';

interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconName;
	size?: Size;
}

export function Icon({
	name,
	size = 'font',
	class: className,
	children,
	...props
}: IconProps) {
	return children ? (
		<span class={`inline-flex ${childrenSizeClassName[size]}`}>
			<Icon name={name} size={size} class={className} {...props} />
			{children}
		</span>
	) : (
		<svg
			{...props}
			class={cn(sizeClassName[size], 'inline self-center', className)}
		>
			<use href={`${href}#${name}`} />
		</svg>
	);
}
