import request from 'supertest';
import { app } from '@src/app';

import { ApiResponse } from '@tests/types/API';
import { User } from '@v1/entities';
import { clear } from '../../clear';

import jwt from 'jsonwebtoken';

describe('Update User', () => {
	const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

	var userInfo = {
		id: '',
		name: 'test',
		lastname: 'jest',
		email: 'test@test.com',
		password: '123',
		cpf: '000.000.000-00',
		access: '',
		refresh: '',
		address: {
			postal_code: '00000-000',
			city: 'Test city',
			state: 'TS',
			street: 'Test street',
			number: 1000,
		},
	};
	beforeAll(async () => await clear());

	it('should create a test user', async () => {
		const token = jwt.sign(userInfo, access_token_secret);
		const { body }: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		userInfo.id = body.user.id;
		userInfo.access = body.access_token;
	});

	it('should login a user', async () => {
		const { body }: ApiResponse<void> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userInfo.access}`);
		userInfo.refresh = body.refresh_token;
	});

	it('should create an address for a user', async () => {
		const { id, refresh, address } = userInfo;

		const { status, body }: ApiResponse<void> = await request(app)
			.post(`/v1/user/address/${id}`)
			.set('authorization', `Bearer ${refresh}`)
			.send(address);

		expect(status).toBe(201);
		expect(body).toBeTruthy();

		expect(body.address).toHaveProperty('user_id');
	});

	it('should delete an address', async () => {
		const { id, refresh } = userInfo;

		const { status, body }: ApiResponse<void> = await request(app)
			.delete(`/v1/user/address/${id}`)
			.set('authorization', `Bearer ${refresh}`)
			.send({ id: 1 });

		expect(status).toBe(202);
		expect(body).toBe('Address deleted with success!');
	});
});
