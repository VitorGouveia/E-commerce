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

	it('should update user', async () => {
		const { id, name, lastname, cpf, email, password, refresh } = userInfo;

		const { status, body }: ApiResponse<User> = await request(app)
			.patch(`/v1/user/${id}`)
			.set('authorization', `Bearer ${refresh}`)
			.send({
				name,
				lastname,
				username: `${lastname}${name}`,
				cpf,
				email,
				password,
			});

		expect(status).toBe(200);
		expect(body.message).toBe('User updated with success!');

		expect(body.user.id).toBe(id);
		expect(body.user.password).not.toBe(password);
	});
});
