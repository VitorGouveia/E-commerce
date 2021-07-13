import { Cart } from '@v1/entities';

describe('Cart entity', () => {
	it('should create a cart entity', () => {
		const { user_id, item_id } = {
			user_id: '00000000-0000-0000-0000-000000000000',
			item_id: 0,
		};

		const cart = new Cart(user_id, item_id);

		expect(cart).toBeTruthy();

		expect(cart.user_id).toBe(user_id);
		expect(cart.item_id).toBe(item_id);
	});
});
