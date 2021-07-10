import request from 'supertest';
import { app } from '@src/app';

import { prisma } from '@src/prisma';
import { ApiResponse } from '../types/API';
import { User } from '@v1/entities';
import auth from '@v1/auth';

describe('User creation', () => {
	it('should create user', async () => {
		const createUserInfo = {
			name: 'test',
			email: 'test@test.com',
			password: '123',
			ip: '0.0.0.0',
			shadow_ban: false,
			confirmed: true,
			ban: false,
			reason_for_ban: '',
			token_version: 0,
		};

		const { id, name, email, password, token_version } = new User(createUserInfo);
		if (!token_version) return;

		const createUserRequest = await request(app).post('/v1/user');
		expect(createUserRequest.status).toBe(200);

		var token = auth.access_token({ id, token_version }, '24h');
		token = `Bearer ${token}`;

		const {
			status,
			body: { user },
		}: ApiResponse<User> = await request(app).post('/v1/user/activate').set('authorization', token);

		expect(status).toBe(201);
		expect(user.id).toBe(id);
		expect(user.name).toBe(name);
		expect(user.email).toBe(email);
		expect(user.password).toBe(password);
	});

	beforeAll(async () => {
		await prisma.user.deleteMany();
	});
});
