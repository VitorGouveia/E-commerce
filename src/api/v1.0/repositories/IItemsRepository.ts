import { Item, Rating, Image } from '@v1/entities';

import { Item as ItemType } from '@prisma/client';

export interface IItemsRepository {
	findById(id: number): Promise<Omit<ItemType, 'image' | 'rating'> | null>;
	findAll(
		category?: string,
		property?: string,
		sort?: 'asc' | 'desc' | string
	): Promise<ItemType[]>;
	findAllPagination(
		page: number,
		quantity: number,
		category?: string,
		property?: string,
		sort?: string
	): Promise<ItemType[] | Item[] | []>;
	rate(rating: Rating): Promise<Rating>;
	update(id: number, { ...props }: Item): Promise<ItemType>;
	save(item: Item): Promise<void>;
	delete(id: number): Promise<void>;
}
