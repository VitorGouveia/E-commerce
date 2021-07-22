import { Request } from 'express';

import { IItemsRepository } from '@v1/repositories';
import { SqliteItemsRepository } from '@v1/repositories/implementations';

import { Item } from '@v1/entities';

class CreateItemService {
	constructor(private itemsRepository: IItemsRepository) {}

	async execute(createItemRequest: Item) {
		try {
			const item = new Item(createItemRequest);
			await this.itemsRepository.save(item);

			return {
				item,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const ItemsRepository = new SqliteItemsRepository();
	const CreateItem = new CreateItemService(ItemsRepository);

	const { item } = await CreateItem.execute(request.body);

	return {
		status: 201,
		item,
		message: 'Item created with success!',
	};
};
