import request from 'supertest';
import { app } from '@src/app';

import { prisma } from '@src/prisma';
import auth from '@v1/auth';
import { sign, verify } from 'jsonwebtoken';
import { ApiResponse } from '../types/API';
import { User } from '@v1/entities';
import { compare } from 'bcrypt';

describe('auth service', () => {
	it('should create an access_token', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

		const tokenInfo = {
			id: '1',
			token_version: 0,
		};

		const jwt_access_token = sign(tokenInfo, access_token_secret);
		const access_token = auth.access_token(tokenInfo, '24h');

		const payload = verify(access_token, access_token_secret);
		const jwt_payload = verify(jwt_access_token, access_token_secret);

		expect(access_token.length).toBeGreaterThan(1);

		expect(payload['id']).toBe(jwt_payload['id']);
		expect(payload['token_version']).toBe(jwt_payload['token_version']);
	});

	it('should create an refresh_token', async () => {
		const refresh_token_secret = String(process.env.JWT_REFRESH_TOKEN);

		const tokenInfo = {
			id: '1',
			token_version: 0,
		};

		const jwt_refresh_token = sign(tokenInfo, refresh_token_secret);
		const refresh_token = auth.refresh_token(tokenInfo, '7d');

		const payload = verify(refresh_token, refresh_token_secret);
		const jwt_payload = verify(jwt_refresh_token, refresh_token_secret);

		expect(refresh_token.length).toBeGreaterThan(1);

		expect(payload['id']).toBe(jwt_payload['id']);
		expect(payload['token_version']).toBe(jwt_payload['token_version']);
	});

	it('should fail to verify jwt token', async () => {
		try {
			const token = auth.verify(undefined, 'access');
		} catch (error) {
			expect(error.message).toBe('Token not supplied to auth lib.');
		}
	});

	it('should fail to verify jwt token', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
		const tokenInfo = {
			id: '1',
			token_version: 0,
		};

		const access_token = sign(tokenInfo, access_token_secret);

		try {
			const token = auth.verify(access_token, 'access');
		} catch (error) {
			expect(error.message).toBe('Your token must include Bearer.');
		}
	});

	it('should fail to login with e-mail', async () => {
		try {
			const loginInfo = {
				email: 'test@test.com',
				password: '123',
			};

			const { user, matchPassword, failed_too_many } = await auth.loginEmail(loginInfo);
		} catch (error) {
			expect(error.message).toBe('Error: Wrong e-mail!');
		}
	});

	it('should fail to login with e-mail and password', async () => {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
			const loginInfo = {
				name: 'test',
				email: 'test@test.com',
				password: '123',
			};

			const { status, body }: ApiResponse<void> = await request(app)
				.post('/v1/user')
				.send(loginInfo);

			expect(status).toBe(200);
			expect(body).toBe('Sent verification message to your e-mail!');

			let token = sign(loginInfo, access_token_secret);
			token = `Bearer ${token}`;

			const { status: activateStatus, body: activateBody }: ApiResponse<User> = await request(app)
				.post('/v1/user/activate')
				.set('authorization', token);

			expect(activateStatus).toBe(201);
			expect(activateBody.message).toBe('User created with success!');
			expect(activateBody.user.name).toBe(loginInfo.name);
			expect(activateBody.user.email).toBe(loginInfo.email);

			const comparePassword = await compare(loginInfo.password, activateBody.user.password);
			expect(comparePassword).toBeTruthy();

			await auth.loginEmail({
				email: loginInfo.email,
				password: '1',
			});
		} catch (error) {
			expect(error.message).toBe('Error: Wrong password!');
		}
	});

	it('should fail too many times when trying to login', async () => {
		const loginInfo = {
			name: 'test',
			email: 'test@test.com',
			password: '1',
		};

		try {
			const test1 = await request(app).post('/v1/user/login').send(loginInfo);
			const test2 = await request(app).post('/v1/user/login').send(loginInfo);
			const test3 = await request(app).post('/v1/user/login').send(loginInfo);
			const test4 = await request(app).post('/v1/user/login').send(loginInfo);
			const test5 = await request(app).post('/v1/user/login').send(loginInfo);
			const test6 = await request(app).post('/v1/user/login').send(loginInfo);

			expect(test6.body).toBe(
				'You failed to login more than 5 times, we sent you a confirmation e-mail.'
			);
		} catch (error) {}
	});

	it('should login with e-mail successfully', async () => {
		const loginInfo = {
			email: 'test@test.com',
			password: '123',
		};

		const { body }: ApiResponse<void> = await request(app).post('/v1/user/login').send(loginInfo);

		expect(body.social_login).toBe(true);
		expect(body.refresh_token.length).toBeGreaterThan(1);
	});

	it('should fail to login with username', async () => {
		const loginInfo = {
			username: 'vitor',
			userhash: '1253',
			password: '123',
		};

		try {
			await auth.loginUsername(loginInfo);
		} catch (error) {
			expect(error.message).toBe('Error: Wrong username!');
		}
	});

	it('should fail to login with username and password', async () => {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
			const createUserInfo = {
				name: 'test2',
				email: 'test2@gmail.com',
				password: '123',
			};

			var loginInfo = {
				username: '',
				userhash: '',
				password: createUserInfo.password,
			};

			const { status, body }: ApiResponse<void> = await request(app)
				.post('/v1/user')
				.send(createUserInfo);

			expect(status).toBe(200);
			expect(body).toBe('Sent verification message to your e-mail!');

			let token = sign(createUserInfo, access_token_secret);
			token = `Bearer ${token}`;

			const { status: activateStatus, body: activateBody }: ApiResponse<User> = await request(app)
				.post('/v1/user/activate')
				.set('authorization', token);

			expect(activateStatus).toBe(201);
			expect(activateBody.message).toBe('User created with success!');
			expect(activateBody.user.name).toBe(createUserInfo.name);
			expect(activateBody.user.email).toBe(createUserInfo.email);

			loginInfo.username = activateBody.user.username;
			loginInfo.userhash = activateBody.user.userhash;

			const comparePassword = await compare(createUserInfo.password, activateBody.user.password);
			expect(comparePassword).toBeTruthy();

			await auth.loginUsername({
				username: loginInfo.username,
				userhash: loginInfo.userhash,
				password: '1',
			});
		} catch (error) {
			expect(error.message).toBe('Error: Wrong password!');
		}
	});

	it('should login with username successfully', async () => {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
			const createUserInfo = {
				name: 'test2',
				email: 'test2@gmail.com',
				password: '123',
			};

			var loginInfo = {
				username: '',
				userhash: '',
				password: createUserInfo.password,
			};

			const { status, body }: ApiResponse<void> = await request(app)
				.post('/v1/user')
				.send(createUserInfo);

			expect(status).toBe(200);
			expect(body).toBe('Sent verification message to your e-mail!');

			let token = sign(createUserInfo, access_token_secret);
			token = `Bearer ${token}`;

			const { status: activateStatus, body: activateBody }: ApiResponse<User> = await request(app)
				.post('/v1/user/activate')
				.set('authorization', token);

			expect(activateStatus).toBe(201);
			expect(activateBody.message).toBe('User created with success!');
			expect(activateBody.user.name).toBe(createUserInfo.name);
			expect(activateBody.user.email).toBe(createUserInfo.email);

			loginInfo.username = activateBody.user.username;
			loginInfo.userhash = activateBody.user.userhash;

			const comparePassword = await compare(createUserInfo.password, activateBody.user.password);
			expect(comparePassword).toBeTruthy();

			const { user } = await auth.loginUsername({
				username: loginInfo.username,
				userhash: loginInfo.userhash,
				password: loginInfo.password,
			});

			console.log(user);
		} catch (error) {}
	});

	beforeAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});
});
