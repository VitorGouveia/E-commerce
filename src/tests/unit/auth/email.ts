import request from 'supertest';
import { app } from '@src/app';

import auth from '@v1/auth';
import { sign } from 'jsonwebtoken';

import { prisma } from '@src/prisma';
import { ApiResponse } from '../../types/API';
import { User } from '@v1/entities';
import { compare } from 'bcrypt';

export const emailTest = () => {
	it('should fail to find e-mail', async () => {
		try {
			await auth.loginEmail({
				email: undefined,
				password: '1',
			});
		} catch (error) {
			expect(error.message).toBe('Could not find an e-mail to auth.');
		}
	});

	it('should fail to login with e-mail', async () => {
		try {
			const loginInfo = {
				email: 'test@test.com',
				password: '123',
			};

			await auth.loginEmail(loginInfo);
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

	it('should fail too many times when trying to login with wrong password', async () => {
		try {
			const loginInfo = {
				email: 'test@test.com',
				password: 'a',
			};

			await prisma.user.updateMany({
				where: {
					email: 'test@test.com',
				},
				data: {
					failed_attemps: 20,
				},
			});

			const { user, matchPassword, failed_too_many } = await auth.loginEmail(loginInfo);

			expect(failed_too_many).toBe(true);
			expect(matchPassword).toBe(false);
			expect(user?.id?.length).toBeGreaterThan(2);
			expect(String(user?.created_at).length).toBeGreaterThan(2);
			expect(user?.name?.length).toBeGreaterThan(1);
			expect(user?.token_version).toBe(1);
		} catch (error) {}
	});

	it('should have session invalidated', async () => {
		const loginInfo = {
			email: 'test@test.com',
			password: '123',
		};

		const { status, body }: ApiResponse<void> = await request(app)
			.post('/v1/user/login')
			.send(loginInfo);
		expect(status).toBe(400);
		expect(body).toBe('You failed to login more than 5 times, we sent you a confirmation e-mail.');
	});

	it('should login with e-mail successfully', async () => {
		await prisma.user.updateMany({
			where: {
				email: 'test@test.com',
			},
			data: {
				token_version: 0,
			},
		});

		const loginInfo = {
			name: 'test',
			email: 'test@test.com',
			password: '123',
		};

		const { user, matchPassword, failed_too_many } = await auth.loginEmail(loginInfo);
		expect(matchPassword).toBe(false);
		expect(failed_too_many).toBe(false);
		expect(user?.name).toBe(loginInfo.name);
		expect(user?.email).toBe(loginInfo.email);
		expect(user?.failed_attemps).toBe(0);
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
