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

	it('should reedem password', async () => {
		const { id, refresh } = userInfo;
		const { status, body }: ApiResponse<void> = await request(app)
			.post(`/v1/user/forgot-password/${id}`)
			.set('authorization', `Bearer ${refresh}`);

		expect(status).toBe(200);
		expect(body).toBe('Sent you an e-mail.');
	});

	it('should fail to login', async () => {
		const { id, refresh } = userInfo;
		const { status, body }: ApiResponse<void> = await request(app)
			.delete(`/v1/user/${id}`)
			.set('authorization', `Bearer ${refresh}`);

		expect(status).toBe(401);
		expect(body).toBe('Your session has been invalidated by an admin.');
	});
});
