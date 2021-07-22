import { Request } from 'express';

import { IItemsRepository } from '@v1/repositories';
import { SqliteItemsRepository } from '@v1/repositories/implementations';

import { Item } from '@v1/entities';

class UpdateItemService {
	constructor(private itemsRepository: IItemsRepository) {}

	async execute(id: number, updateItemRequest: Item) {
		try {
			const item = await this.itemsRepository.update(id, updateItemRequest);

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
	const UpdateItem = new UpdateItemService(ItemsRepository);

	const { item } = await UpdateItem.execute(Number(request.params.id), request.body);

	return {
		status: 202,
		message: 'Updated item with success!',
		item,
	};
};
