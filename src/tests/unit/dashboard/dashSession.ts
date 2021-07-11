import request from 'supertest';
import { app } from '@src/app';

import users from './users.json';
import { sign } from 'jsonwebtoken';
import { ApiResponse } from '@tests/types/API';
import { User } from '@v1/entities';
import { prisma } from '@src/prisma';
import auth from '@v1/auth';

var UserDTO = {
	id: '',
	name: 'test',
	email: 'test@test.com',
	password: '',
	access: '',
	refresh: '',
};

var adminUser = {
	id: '',
	access: '',
	refresh: '',
};

export const dashSession = () => {
	it('should create admin refresh token', async () => {
		const login = auth.admin_refresh({ id: '1', token_version: 0 }, '7d');
		expect(login.length).toBeGreaterThan(1);
	});

	it('should fail to find token when invalidating user session', async () => {
		await prisma.user.deleteMany();

		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
		var token = sign(UserDTO, access_token_secret);
		token = `Bearer ${token}`;

		const activate: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', token);
		UserDTO.id = activate.body.user.id;
		UserDTO.access = activate.body.access_token;

		const admin = await request(app).post('/v1/user/admin').send(users);
		adminUser.access = admin.body.user.access_token;

		const adminLogin: ApiResponse<User> = await request(app)
			.post('/v1/user/admin/login')
			.set('authorization', `Bearer ${adminUser.access}`);
		adminUser.refresh = adminLogin.body.refresh_token;

		const invalidate = await request(app)
			.get(`/v1/user/invalidate/${UserDTO.id}`)
			.set('authorization', adminUser.refresh);
		expect(invalidate.status).toBe(401);
		expect(invalidate.body).toBe('Failed to verify Admin user JWT token.');
	});

	it('should invalidate user session', async () => {
		await prisma.user.deleteMany();

		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
		var token = sign(UserDTO, access_token_secret);
		token = `Bearer ${token}`;

		const activate: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', token);
		UserDTO.id = activate.body.user.id;
		UserDTO.access = activate.body.access_token;

		const admin = await request(app).post('/v1/user/admin').send(users);
		adminUser.access = admin.body.user.access_token;

		const adminLogin: ApiResponse<User> = await request(app)
			.post('/v1/user/admin/login')
			.set('authorization', `Bearer ${adminUser.access}`);
		adminUser.refresh = adminLogin.body.refresh_token;

		const invalidate = await request(app)
			.get(`/v1/user/invalidate/${UserDTO.id}`)
			.set('authorization', `Bearer ${adminUser.refresh}`);
		expect(invalidate.status).toBe(200);
		expect(invalidate.body).toBe('User session invalidated');

		const { status, body }: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${UserDTO.access}`);

		expect(status).toBe(400);
		expect(body).toBe('Your session was invalidated.');
	});

	it('should ban user', async () => {
		const ban: ApiResponse<User> = await request(app)
			.get(`/v1/user/ban/${UserDTO.id}`)
			.set('authorization', `Bearer ${adminUser.refresh}`)
			.query({ reason: 'test ban.' });

		expect(ban.body).toBe('Banned user with success!');

		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${UserDTO.access}`);
		expect(login.body).toBe('Your banned. If you think this is a mistake contact our team.');
	});

	it('should shadow ban user', async () => {
		const shadowBan: ApiResponse<User> = await request(app)
			.get(`/v1/user/ban/${UserDTO.id}`)
			.set('authorization', `Bearer ${adminUser.refresh}`)
			.query({ shadow: true, reason: 'test ban.' });
		expect(shadowBan.body).toBe('Banned user with success!');

		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${UserDTO.access}`);
		expect(login.body).toBe("Sorry, we couldn't complete your request, please try again later.");
	});
};
