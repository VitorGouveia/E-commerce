import { ICartRepository } from '@v1/repositories';

import { Cart } from '@prisma/client';
import { prisma } from '@src/prisma';

export class SqliteCartRepository implements ICartRepository {
	async list({ user_id, item_id }): Promise<Cart[]> {
		if (item_id) {
			const cart = await prisma.cart.findMany({
				where: {
					item_id,
				},
			});

			return cart;
		}

		const cart = await prisma.cart.findMany({
			where: {
				user_id,
			},
		});

		return cart;
	}

	async save(user_id: string, item_id: number): Promise<void> {
		await prisma.cart.create({
			data: {
				item_id,
				user_id,
			},
		});
	}

	async delete(user_id: string, id: number): Promise<void> {
		await prisma.cart.deleteMany({
			where: {
				id,
				user_id,
			},
		});
	}
}
