import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '@src/app';

import { clear } from '../clear';
import { ApiResponse } from '@tests/types/API';

import users from '@src/users.json';
import items from '@src/items.json';

describe('Dashboard controller', () => {
	const dummy_id = '00000000-0000-0000-0000-000000000000';
	const jwt_access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

	type User = {
		id: string;
		email: string;
		access_token: string;
	};

	var admin = {
		id: '',
		access: '',
		refresh: '',
	};

	var userInfo = {
		id: '',
		name: 'test',
		email: 'test@test.com',
		password: '123',
		access: '',
	};

	it('should items from file', async () => {
		const { status, body }: ApiResponse<void> = await request(app)
			.post('/v1/item/load')
			.send(items);

		expect(status).toBe(200);
		expect(body.message).toBe('Loaded items from file with success!');
	});

	it('should load users from file', async () => {
		const { status, body }: ApiResponse<User> = await request(app)
			.post('/v1/user/admin')
			.send(users);

		expect(status).toBe(200);
		expect(body).toBeTruthy();

		admin.access = body.user.access_token;

		expect(body.message).toBe('Loaded admin users from file.');
		expect(body.user.id.length).toBe(36);
		expect(body.user.email).toBe('admin@admin.com');
		expect(body.user).toHaveProperty('access_token');
	});

	it('should login admin user', async () => {
		const { access } = admin;

		const { status, body }: ApiResponse<void> = await request(app)
			.post('/v1/user/admin/login')
			.set('authorization', `Bearer ${access}`);

		expect(status).toBe(200);
		expect(body).toBeTruthy();

		admin.refresh = body.refresh_token;

		expect(body.jwt_login).toBe(true);
		expect(body.refresh_token.length).toBeGreaterThan(10);
	});

	it('should create test user', async () => {
		const token = jwt.sign(userInfo, jwt_access_token_secret);
		const activate: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		userInfo.id = activate.body.user.id;
		userInfo.access = activate.body.access_token;
	});

	it('should fail to invalidate session', async () => {
		const { body }: ApiResponse<void> = await request(app).get(`/v1/user/ban/${userInfo.id}`);

		expect(body.message).toBe('No Dash JWT refresh token was found! Redirect to login.');
	});

	it('should invalidate user session', async () => {
		const { status, body }: ApiResponse<void> = await request(app)
			.get(`/v1/user/invalidate/${userInfo.id}`)
			.set('authorization', `Bearer ${admin.refresh}`);

		expect(status).toBe(200);
		expect(body).toBe('User session invalidated');

		const login: ApiResponse<void> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userInfo.access}`);

		expect(login.status).toBe(400);
		expect(login.body).toBe('Your session was invalidated.');
	});

	it('should fail to invalidate user session', async () => {
		const { status, body }: ApiResponse<void> = await request(app)
			.get(`/v1/user/invalidate/${dummy_id}`)
			.set('authorization', `Bearer ${admin.refresh}`)
			.query({ reason: 'test ban' });

		expect(status).toBe(400);
		expect(body).toBe('Could not find user with token id.');
	});

	it('should ban user', async () => {
		const { status, body }: ApiResponse<void> = await request(app)
			.get(`/v1/user/ban/${userInfo.id}`)
			.query({ reason: 'test ban' })
			.set('authorization', `Bearer ${admin.refresh}`);

		expect(status).toBe(202);
		expect(body).toBe('Banned user with success!');

		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userInfo.access}`);

		expect(login.status).toBe(400);
		expect(login.body).toBe('You are banned. If you think this is a mistake contact our team.');
	});

	it('should shadow ban user', async () => {
		const { status, body }: ApiResponse<void> = await request(app)
			.get(`/v1/user/ban/${userInfo.id}`)
			.query({ shadow: true, reason: 'test ban' })
			.set('authorization', `Bearer ${admin.refresh}`);

		expect(status).toBe(202);
		expect(body).toBe('Banned user with success!');

		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userInfo.access}`);

		expect(login.status).toBe(400);
		expect(login.body).toBe("Sorry, we couldn't complete your request, please try again later.");
	});

	beforeAll(async () => await clear());
});
