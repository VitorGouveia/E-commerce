import { Request } from 'express';

import { ICartRepository, IItemsRepository } from '@v1/repositories';
import { SqliteCartRepository, SqliteItemsRepository } from '@v1/repositories/implementations';

class DeleteItemService {
	constructor(private itemsRepository: IItemsRepository, private cartRepository: ICartRepository) {}

	async execute(id: number, { query }: Request) {
		try {
			const confirmed = query.confirmed;

			if (!!confirmed) {
				await this.itemsRepository.delete(id);
			}

			const itemInCart = await this.cartRepository.list({ item_id: id });

			var id_tmp = '';
			var items: string[] = [];

			for (const item of itemInCart) {
				if (item.user_id === id_tmp) continue;
				id_tmp = item.user_id;
				items.push(item.user_id);
			}

			if (itemInCart.length > 0)
				throw new Error(
					`There are ${itemInCart.length} items is in ${items.length} user carts, use the option confirmed to execute it with admin priviledges.`
				);

			await this.itemsRepository.delete(id);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const ItemsRepository = new SqliteItemsRepository();
	const CartRepository = new SqliteCartRepository();
	const DeleteItem = new DeleteItemService(ItemsRepository, CartRepository);

	await DeleteItem.execute(Number(request.params.id), request);

	return {
		status: 200,
		message: 'Item deleted with success!',
	};
};
