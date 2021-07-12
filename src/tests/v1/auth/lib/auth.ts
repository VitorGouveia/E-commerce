import auth from '@v1/auth';
import jwt from 'jsonwebtoken';

import { prisma } from '@src/prisma';

import request from 'supertest';
import { app } from '@src/app';

const jwt_access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
const jwt_refresh_token_secret = String(process.env.JWT_REFRESH_TOKEN);

const dash_access_token_secret = String(process.env.DASH_ACCESS_TOKEN);
const dash_refresh_token_secret = String(process.env.DASH_REFRESH_TOKEN);

const tokenInfo = {
	id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
	token_version: 0,
};

var userInfo = {
	id: '',
	name: 'test',
	username: '',
	userhash: '',
	email: 'test@test.com',
	password: '123',
};

describe('auth', () => {
	it('should create a normal access_token', async () => {
		const access_token = auth.access_token(tokenInfo, '24h');
		const decoded_token = jwt.verify(access_token, jwt_access_token_secret);

		expect(access_token).toBeTruthy();
		expect(access_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should create a normal refresh_token', async () => {
		const refresh_token = auth.refresh_token(tokenInfo, '7d');
		const decoded_token = jwt.verify(refresh_token, jwt_refresh_token_secret);

		expect(refresh_token).toBeTruthy();
		expect(refresh_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should create an admin access_token', async () => {
		const access_token = auth.admin_access(tokenInfo, '24h');
		const decoded_token = jwt.verify(access_token, dash_access_token_secret);

		expect(access_token).toBeTruthy();
		expect(access_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should create an admin refresh_token', async () => {
		const refresh_token = auth.admin_refresh(tokenInfo, '7d');
		const decoded_token = jwt.verify(refresh_token, dash_refresh_token_secret);

		expect(refresh_token).toBeTruthy();
		expect(refresh_token.length).toBeGreaterThan(50);

		expect(decoded_token['id']).toBe(tokenInfo.id);
		expect(decoded_token['token_version']).toBe(tokenInfo.token_version);
	});

	it('should fail to verify a undefined token', async () => {
		try {
			auth.verify(undefined, 'access');
		} catch (error) {
			expect(error.message).toBe('Token not supplied to auth lib.');
		}
	});

	it('should fail to verify a token without Bearer', async () => {
		try {
			var access_token = auth.access_token(tokenInfo, '24h');

			auth.verify(access_token, 'access');
		} catch (error) {
			expect(error.message).toBe('Your token must include Bearer.');
		}
	});

	it('should verify a normal access_token', async () => {
		const access_token = auth.access_token(tokenInfo, '24h');

		const decoded_auth = auth.verify(`Bearer ${access_token}`, 'access');
		const decoded_jwt = jwt.verify(access_token, jwt_access_token_secret);

		expect(decoded_auth).toBeTruthy();

		expect(decoded_auth['id']).toBe(decoded_jwt['id']);
		expect(decoded_auth['token_version']).toBe(decoded_jwt['token_version']);

		expect(decoded_auth['iat']).toBe(decoded_jwt['iat']);
		expect(decoded_auth['exp']).toBe(decoded_jwt['exp']);
	});

	it('should verify a normal refresh_token', async () => {
		const refresh_token = auth.refresh_token(tokenInfo, '24h');

		const decoded_auth = auth.verify(`Bearer ${refresh_token}`, 'refresh');
		const decoded_jwt = jwt.verify(refresh_token, jwt_refresh_token_secret);

		expect(decoded_auth).toBeTruthy();

		expect(decoded_auth['id']).toBe(decoded_jwt['id']);
		expect(decoded_auth['token_version']).toBe(decoded_jwt['token_version']);

		expect(decoded_auth['iat']).toBe(decoded_jwt['iat']);
		expect(decoded_auth['exp']).toBe(decoded_jwt['exp']);
	});

	it('should not be able to find an e-mail to auth to', async () => {
		try {
			await auth.loginEmail({
				email: undefined,
				password: userInfo.password,
			});
		} catch (error) {
			expect(error.message).toBe('Could not find an e-mail to auth.');
		}
	});

	it('should be able to login with e-mail', async () => {
		const token = jwt.sign(userInfo, jwt_access_token_secret);
		const activate = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		const { user, failed_too_many, matchPassword } = await auth.loginEmail(userInfo);

		userInfo.username = activate.body.user.username;
		userInfo.userhash = activate.body.user.userhash;

		expect(user.id.length).toBe(36);
		expect(user.name).toBe(userInfo.name);
		expect(user.email).toBe(userInfo.email);

		expect(matchPassword).toBe(false);
		expect(failed_too_many).toBe(false);
	});

	it('should not be able to find an username to auth to', async () => {
		try {
			await auth.loginUsername({
				username: undefined,
				userhash: undefined,
				password: '123',
			});
		} catch (error) {
			expect(error.message).toBe('Could not find an username and userhash to auth.');
		}
	});

	it('should be able to login with username', async () => {
		const { user, failed_too_many, matchPassword } = await auth.loginUsername(userInfo);

		expect(user.id.length).toBe(36);
		expect(user.name).toBe(userInfo.name);
		expect(user.email).toBe(userInfo.email);

		expect(matchPassword).toBe(false);
		expect(failed_too_many).toBe(false);
	});

	beforeAll(async () => {
		await prisma.user.deleteMany();
	});
});
