import request from 'supertest';
import { app } from '@src/app';

import { clear } from '@tests/v1/clear';
import { ApiResponse } from '@tests/types/API';
import { Item } from '@v1/entities';

describe('Read item', () => {
	var itemInfo = {
		id: '',
	};

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

	it('should create items', async () => {
		await request(app).post('/v1/item').send(itemDTO);
		await request(app).post('/v1/item').send(itemDTO);
		const { body }: ApiResponse<any[]> = await request(app).get('/v1/item').send(itemDTO);
		itemInfo.id = body.items[0].id;
	});

	it('should list all items', async () => {
		const { status, body }: ApiResponse<Item[]> = await request(app).get('/v1/item');

		expect(status).toBe(202);
		expect(body.message).toBe('Listed items with success!');
		expect(body.items).toBeTruthy();
	});

	it('should make a id search', async () => {
		const { status, body }: ApiResponse<any> = await request(app).get(`/v1/item/${itemInfo.id}`);
		expect(status).toBe(202);
		expect(body.items.id).toBe(itemInfo.id);
	});

	it('should make a category search', async () => {
		const { status, body }: ApiResponse<Item[]> = await request(app)
			.get('/v1/item')
			.query({ category: 'tests' });

		expect(status).toBe(202);
		expect(body.items).toBeTruthy();
		expect(body.items.length).toBeGreaterThan(0);
	});

	it('should make property search', async () => {
		const { status, body }: ApiResponse<any[]> = await request(app)
			.get('/v1/item')
			.query({ property: 'id', sort: 'asc' });

		expect(status).toBe(202);
		expect(body.items[0].id).toBeLessThan(body.items[1].id);
	});

	it('should make a pagination search', async () => {
		const { status, body }: ApiResponse<Item[]> = await request(app)
			.get('/v1/item')
			.query({ page: 0, quantity: 1 });

		expect(status).toBe(202);
		expect(body.items.length).toBe(1);
	});

	it('should make a category search with pagination', async () => {
		const { status, body }: ApiResponse<Item[]> = await request(app)
			.get('/v1/item')
			.query({ page: 0, quantity: 15, category: 'tests' });
		expect(status).toBe(202);
	});

	it('should make property search with pagination', async () => {
		const { status, body }: ApiResponse<any[]> = await request(app)
			.get('/v1/item')
			.query({ page: 0, quantity: 15, property: 'id', sort: 'desc' });

		expect(status).toBe(202);
		expect(body.items[0].id).toBeGreaterThan(body.items[1].id);
	});

	beforeAll(async () => await clear());
});
