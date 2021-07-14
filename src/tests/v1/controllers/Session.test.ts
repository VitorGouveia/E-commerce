import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '@src/app';

import { clear } from '../clear';
import { ApiResponse } from '@tests/types/API';
import { User } from '@v1/entities';

describe('Session controller', () => {
	const jwt_access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

	var userInfo = {
		id: '',
		name: 'test',
		email: 'test@test.com',
		password: '123',
		access: '',
	};

	it('should login user with JWT', async () => {
		const token = jwt.sign(userInfo, jwt_access_token_secret);
		const activate: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		userInfo.id = activate.body.user.id;
		userInfo.access = activate.body.access_token;

		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userInfo.access}`);

		expect(login.status).toBe(200);
		expect(login.body.jwt_login).toBe(true);
		expect(login.body.refresh_token.length).toBeGreaterThan(10);
	});

	it.todo('should login user with login user with e-mail');
	it.todo('should not be able to login user with wrong e-mail');
	it.todo('should not be able to e-mail login user with wrong password');

	it.todo('should login user with login user with username');
	it.todo('should not be able to login user with wrong username');
	it.todo('should not be able to username login user with wrong password');

	beforeAll(async () => await clear());
});
