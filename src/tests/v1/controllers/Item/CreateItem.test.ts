import request from 'supertest';
import { app } from '@src/app';

import { clear } from '@tests/v1/clear';
import { ApiResponse } from '@tests/types/API';
import { Item } from '@v1/entities';

describe("Create Item", () => {
  it('should create an item', async () => {
		const itemDTO = {
			name: 'test jest',
			short_name: 'test',
			description: 'test jest testing tests',
			category: 'tests',
			discount: 0,
			price: 1000,
			shipping_price: 100,
			image: [],
		};

		const { status, body }: ApiResponse<Item> = await request(app).post('/v1/item').send(itemDTO);

		expect(status).toBe(201)
		expect(body.item).toBeTruthy()

		expect(body.item.name).toBe(itemDTO.name)
		expect(body.item.short_name).toBe(itemDTO.short_name)
		expect(body.item.description).toBe(itemDTO.description)
		expect(body.item.category).toBe(itemDTO.category)
		expect(body.item.discount).toBe(itemDTO.discount)
		expect(body.item.price).toBe(itemDTO.price)
		expect(body.item.shipping_price).toBe(itemDTO.shipping_price)
	})

  beforeAll(async () => await clear())
})