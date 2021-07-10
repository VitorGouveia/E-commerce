import request from 'supertest';

import { prisma } from '@src/prisma';
import auth from '@v1/auth';
import { ApiResponse } from '@src/tests/types/API';
import { compare } from 'bcrypt';
import { User } from '@src/api/v1.0/entities';
import { app } from '@src/app';
import { sign } from 'jsonwebtoken';

export const usernameTest = () => {
	it('should fail to find username and userhash', async () => {
		try {
			await auth.loginUsername({
				username: undefined,
				userhash: undefined,
				password: '1',
			});
		} catch (error) {
			expect(error.message).toBe('Could not find an username and userhash to auth.');
		}
	});

	it('should fail to login with username', async () => {
		try {
			const loginInfo = {
				username: 'test',
				userhash: '0000',
				password: '123',
			};

			await auth.loginUsername(loginInfo);
		} catch (error) {
			expect(error.message).toBe('Error: Wrong username!');
		}
	});

	it('should fail to login with username and password', async () => {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
			const createUserInfo = {
				name: 'test',
				email: 'test@test.com',
				password: '123',
			};

			var loginInfo = {
				username: '',
				userhash: '',
				password: createUserInfo.password,
			};

			const test: ApiResponse<void> = await request(app).post('/v1/user').send(createUserInfo);

			expect(test.status).toBe(200);
			expect(test.body).toBe('Sent verification message to your e-mail!');

			let token = sign(createUserInfo, access_token_secret);
			token = `Bearer ${token}`;

			const { status, body }: ApiResponse<User> = await request(app)
				.post('/v1/user/activate')
				.set('authorization', token);

			expect(status).toBe(201);
			expect(body.message).toBe('User created with success!');
			expect(body.user.name).toBe(createUserInfo.name);
			expect(body.user.email).toBe(createUserInfo.email);

			loginInfo.username = body.user.username;
			loginInfo.userhash = body.user.userhash;

			const comparePassword = await compare(createUserInfo.password, body.user.password);
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

	it('should fail too many time when trying to login with wrong password', async () => {
		try {
			await prisma.user.deleteMany();

			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
			const createUserInfo = {
				name: 'test',
				email: 'test2@test.com',
				password: '123',
			};

			var loginInfo = {
				username: '',
				userhash: '',
				password: 'a',
			};

			const test: ApiResponse<void> = await request(app).post('/v1/user').send(createUserInfo);

			expect(test.status).toBe(200);
			expect(test.body).toBe('Sent verification message to your e-mail!');

			let token = sign(createUserInfo, access_token_secret);
			token = `Bearer ${token}`;

			const { status, body }: ApiResponse<User> = await request(app)
				.post('/v1/user/activate')
				.set('authorization', token);

			expect(status).toBe(201);
			expect(body.message).toBe('User created with success!');
			expect(body.user.name).toBe(createUserInfo.name);
			expect(body.user.email).toBe(createUserInfo.email);

			loginInfo.username = body.user.username;
			loginInfo.userhash = body.user.userhash;

			const comparePassword = await compare(createUserInfo.password, body.user.password);
			expect(comparePassword).toBeTruthy();

			await prisma.user.updateMany({
				where: {
					username: loginInfo.username,
					userhash: loginInfo.userhash,
				},
				data: {
					failed_attemps: 20,
				},
			});

			const { failed_too_many } = await auth.loginUsername(loginInfo);
			expect(failed_too_many?.id).toBe(body.user.id);
		} catch (error) {}
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
};
