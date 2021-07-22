import { Request } from 'express';

import { ICartRepository } from '@v1/repositories';
import { SqliteCartRepository } from '@v1/repositories/implementations';

class CreateCartService {
	constructor(private cartRepository: ICartRepository) {}

	async execute(user_id: string, { item_id }: any) {
		try {
			await this.cartRepository.save(user_id, item_id);

			const [cart] = await this.cartRepository.list({ user_id, item_id });

			return {
				cart,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const cartRepository = new SqliteCartRepository();
	const CartService = new CreateCartService(cartRepository);

	const { cart } = await CartService.execute(request.params.id, request.body);

	return {
		status: 201,
		cart,
		message: 'Cart item created with success!',
	};
};
