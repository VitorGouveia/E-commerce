import { Image, Item, Rating } from '@v1/entities';

describe('Item entity', () => {
	it('should create an item entity', () => {
		const ratingDTO: Rating[] = [
			{
				item_id: 1,
				average: 0,
				one_star: 1,
				two_star: 1,
				three_star: 1,
				four_star: 1,
				five_star: 1,
				message: 'Test message.',
			},
		];

		const imageDTO: Image[] = [
			{
				item_id: 1,
				link: 'www.test.com/img',
			},
		];

		const itemDTO: Item = {
			created_at: Date.now(),
			name: 'test jest',
			short_name: 'test',
			description: 'test jest testing tests',
			category: 'tests',
			discount: 0,
			price: 1,
			shipping_price: 0,
			rating: ratingDTO,
			image: imageDTO,
		};

		const item = new Item(itemDTO, imageDTO);

		expect(item).toBeTruthy();

		expect(item.name).toBe(itemDTO.name);
		expect(item.short_name).toBe(itemDTO.short_name);
		expect(item.description).toBe(itemDTO.description);
		expect(item.category).toBe(itemDTO.category);
		expect(item.discount).toBe(itemDTO.discount);
		expect(item.price).toBe(itemDTO.price);
		expect(item.shipping_price).toBe(itemDTO.shipping_price);
		expect(item.rating).toBe(ratingDTO);
		expect(item.image).toBe(imageDTO);
	});
});
