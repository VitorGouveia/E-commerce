import request from 'supertest';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { app } from '@src/app';
import { prisma } from '@src/prisma';
import { User } from '@v1/entities';

import { ApiResponse } from '@src/tests/types/API';

const CreateUserRequest = {
	name: 'test',
	email: 'test@test.com',
	password: '123',
};

export const CreateUserTest = () => {
	it('should create user entity', async () => {
		const user = new User({
			name: 'test',
			lastname: 'jest',
			email: 'test@test.com',
			password: '123',
			ip: '0.0.0.0',
			token_version: 0,
			cpf: '000.000.000-00',
		});

		expect(user.name).toBe('test');
		expect(user.lastname).toBe('jest');
		expect(user.email).toBe('test@test.com');
		expect(user.cpf).toBe('000.000.000-00');
		expect(user.password.slice(1, 3)).toBe('2b');
		expect(user.ip?.slice(1, 3)).toBe('2b');
		expect(user.token_version).toBe(0);
		expect(String(user.userhash).length).toBe(4);
	});

	it('should send token to e-mail', async () => {
		const { name, email, password } = CreateUserRequest;

		const { status, body }: ApiResponse<void> = await request(app).post('/v1/user').send({
			name,
			email,
			password,
		});

		expect(status).toBe(200);

		expect(body).toBe('Sent verification message to your e-mail!');
	});

	it('should fail to activate user', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

		let token = sign(CreateUserRequest, access_token_secret);

		try {
			const { body }: ApiResponse<User> = await request(app)
				.post('/v1/user/activate')
				.set('authorization', token);
			expect(body).toBe('Your token must include Bearer');
		} catch (error) {
			console.log(error);
			expect(error).toBeTruthy();
		}
	});

	it('should create user with e-mail token', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
		const { name, email, password } = CreateUserRequest;

		let token = sign(CreateUserRequest, access_token_secret);
		token = `Bearer ${token}`;

		const { status, body, headers }: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', token);

		expect(status).toBe(201);

		const { access_token, user, message } = body;

		expect(headers.authorization.length).toBeGreaterThan(1);
		expect(access_token.length).toBeGreaterThan(1);

		expect(message).toBe('User created with success!');

		expect(user.name).toBe(name);
		expect(user.email).toBe(email);

		const comparePassword = await compare(password, user.password);
		expect(comparePassword).toBeTruthy();
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
