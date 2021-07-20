import { IOrderRepository } from '@v1/repositories';

import { Order } from '@v1/entities';
import { Order as OrderType } from '@prisma/client';
import { prisma } from '@src/prisma';

export class SqliteOrderRepository implements IOrderRepository {
	async list(): Promise<OrderType[]> {
		const orders = await prisma.order.findMany({
			include: {
				address: true,
				item: true,
				payment: true,
				user: true,
			},
		});

		return orders;
	}
	async save({ ...props }: Order): Promise<void> {
		await prisma.order.create({
			data: { ...props },
		});
	}

	async delete(id: number): Promise<void> {
		await prisma.order.delete({
			where: {
				id,
			},
		});
	}
}
