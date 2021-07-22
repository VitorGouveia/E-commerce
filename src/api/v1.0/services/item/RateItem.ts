import { Request } from 'express';

import { IItemsRepository } from '@v1/repositories';
import { SqliteItemsRepository } from '@v1/repositories/implementations';

import { Rating } from '@v1/entities';

class RateItemService {
	constructor(private itemsRepository: IItemsRepository) {}

	async execute(id: number, rateItemRequest: Rating) {
		try {
			const rating = new Rating(rateItemRequest, id);
			const { average, ...props } = await this.itemsRepository.rate(rating);

			const item = { ...props };

			return {
				item,
				average,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const ItemsRepository = new SqliteItemsRepository();
	const RateItem = new RateItemService(ItemsRepository);

	const { item, average } = await RateItem.execute(Number(request.params.id), request.body);

	return {
		status: 200,
		item,
		average,
		message: 'Rated item with success!',
	};
};
