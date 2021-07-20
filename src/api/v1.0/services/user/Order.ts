import { Request } from 'express';

import { IOrderRepository } from '@v1/repositories';
import { SqliteOrderRepository } from '@v1/repositories/implementations';

class OrderService {
	constructor(private orderRepository: IOrderRepository) {}

	async execute() {
		try {
			const orders = await this.orderRepository.list();

			return {
				orders,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const orderRepository = new SqliteOrderRepository();
		const Order = new OrderService(orderRepository);

		const { orders } = await Order.execute();

		return {
			status: 200,
			message: 'listed orders with success!',
			orders,
		};
	} catch (error) {
		return {
			status: 400,
			error: true,
			message: error.message,
		};
	}
};
