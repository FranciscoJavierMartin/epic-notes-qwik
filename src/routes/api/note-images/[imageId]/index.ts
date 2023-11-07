import { prisma } from '@/db/db.server';
import { type RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ params, send, error }) => {
	if (!params.imageId) {
		throw error(400, 'Image ID is required');
	}

	const image = await prisma.noteImage.findUnique({
		where: { id: params.imageId },
		select: { blob: true },
	});

	if (!image) {
		throw error(404, 'Image not found');
	}

	send(200, image.blob);
};
