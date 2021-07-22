import { Request } from 'express';

import { IItemsRepository } from '@v1/repositories';
import { SqliteItemsRepository } from '@v1/repositories/implementations';

import { Item } from '@v1/entities';

class LoadFileService {
	constructor(private itemsRepository: IItemsRepository) {}

	async execute(items: Item[]) {
		try {
			items.forEach(async (item: Item) => {
				const newItem = new Item(item, item.image);
				await this.itemsRepository.save(newItem);
			});

			return;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const itemsRepository = new SqliteItemsRepository();
	const LoadFile = new LoadFileService(itemsRepository);

	await LoadFile.execute(request.body);

	return {
		status: 200,
		message: 'Loaded items from file with success!',
	};
};
