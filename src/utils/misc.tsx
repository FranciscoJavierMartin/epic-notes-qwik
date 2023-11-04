import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A handy utility that makes constructing class names easier.
 * It also merges tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function checkHoneypot(fieldValue: unknown): void {
	if (fieldValue) {
		throw new Response('Form not submitted properly', { status: 400 });
	}
}
