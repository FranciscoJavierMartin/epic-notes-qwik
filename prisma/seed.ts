import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.note.findFirst().then((firstNote) => {
	if (!firstNote) {
		throw new Error('You need to have a note in the database first');
	}

	return Promise.all([
		fs.promises.readFile('./tests/fixtures/images/kody-notes/cute-koala.png'),
		fs.promises.readFile('./tests/fixtures/images/kody-notes/koala-eating.png'),
	]).then(([image1, image2]) => {
		return prisma.note.update({
			where: { id: firstNote.id },
			data: {
				images: {
					create: [
						{
							altText: 'an adorable koala cartoon illustration',
							contentType: 'image/png',
							blob: image1,
						},
						{
							altText: 'a cartoon illustration of a koala in a tree eating',
							contentType: 'image/png',
							blob: image2,
						},
					],
				},
			},
		});
	});
});
