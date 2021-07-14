import { prisma } from '@src/prisma';

export const clear = async () => {
	await prisma.rating.deleteMany();
	await prisma.image.deleteMany();
	await prisma.item.deleteMany();

	await prisma.cart.deleteMany();
	await prisma.address.deleteMany();
	await prisma.user.deleteMany();
};
