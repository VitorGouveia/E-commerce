import { Cart } from '@prisma/client';

export interface ICartRepository {
	list(user_id: string): Promise<Cart[]>;
	save(user_id: string, item_id: number): Promise<void>;
	delete(user_id: string, id?: number): Promise<void>;
}
