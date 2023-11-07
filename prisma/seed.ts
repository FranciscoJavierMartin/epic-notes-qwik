import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.user.deleteMany().then(() => {
	return Promise.all([
		fs.promises.readFile('./tests/fixtures/images/kody-notes/cute-koala.png'),
		fs.promises.readFile('./tests/fixtures/images/kody-notes/koala-eating.png'),
	]).then(([image1, image2]) => {
		return prisma.user.create({
			data: {
				email: 'kody@kcd.dev',
				username: 'kody',
				name: 'Kody',
				notes: {
					create: [
						{
							id: 'd27a197e',
							title: 'Basic Koala Facts',
							content:
								'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',

							images: {
								create: [
									{
										altText: 'an adorable koala cartoon illustration',
										contentType: 'image/png',
										blob: image1,
									},
									{
										altText:
											'a cartoon illustration of a koala in a tree eating',
										contentType: 'image/png',
										blob: image2,
									},
								],
							},
						},
					],
				},
			},
		});
	});
});
