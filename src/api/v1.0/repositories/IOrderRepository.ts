import { Order } from '@v1/entities';
import { Order as OrderType } from '@prisma/client';

export interface IOrderRepository {
	list(): Promise<OrderType[]>;
	save(order: Order): Promise<void>;
	delete(id: number): Promise<void>;
}
