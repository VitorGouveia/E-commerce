import { Request } from 'express';
import { ParsedQs } from 'qs';

import { ICartRepository } from '@v1/repositories';
import { SqliteCartRepository } from '@v1/repositories/implementations';

class DeleteCartService {
	constructor(private cartRepository: ICartRepository) {}

	async execute(user_id: string, { query }: Request<ParsedQs>) {
		try {
			const id = Number(query.id);

			await this.cartRepository.delete(user_id, id);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const CartRepository = new SqliteCartRepository();
	const DeleteCart = new DeleteCartService(CartRepository);

	await DeleteCart.execute(request.params.id, request);

	return {
		status: 200,
		message: 'Delete item from cart with success!',
	};
};
