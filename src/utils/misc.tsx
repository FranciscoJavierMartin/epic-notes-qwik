import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import userFallback from '@/assets/user.png';

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

export function getUserImgSrc(imageId?: string | null): string {
	return imageId ? `/api/user-images/${imageId}` : userFallback;
}

export function getNoteImgSrc(imageId: string): string {
	return `/api/note-images/${imageId}`;
}
