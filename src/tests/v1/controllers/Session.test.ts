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
		username: "",
		userhash: "",
		password: '123',
		access: '',
	};

	it("should activate a user", async () => {
		const token = jwt.sign(userInfo, jwt_access_token_secret);
		const activate: ApiResponse<User> = await request(app)
			.post('/v1/user/activate')
			.set('authorization', `Bearer ${token}`);

		userInfo.id = activate.body.user.id;
		userInfo.access = activate.body.access_token;

		userInfo.username = activate.body.user.username
		userInfo.userhash = activate.body.user.userhash
	})

	it('should login user with JWT', async () => {
		const login: ApiResponse<User> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${userInfo.access}`);

		expect(login.status).toBe(200);
		expect(login.body.jwt_login).toBe(true);
		expect(login.body.refresh_token.length).toBeGreaterThan(10);
	});

	it('should login user with login user with e-mail', async () => {
		const { email, password } = userInfo
		const login: ApiResponse<User> = await request(app).post("/v1/user/login").send({ email, password })

		expect(login.status).toBe(200)

		expect(login.body.social_login).toBe(true)
		expect(login.body.refresh_token.length).toBeGreaterThan(10)
	});

	it('should not be able to login user with wrong e-mail', async () => {
		const { password } = userInfo
		const login: ApiResponse<void> = await request(app).post("/v1/user/login").send({ email: "test@jest.com", password })

		expect(login.status).toBe(400)
		expect(login.body).toBe("Wrong e-mail!")
	});

	it('should not be able to e-mail login user with wrong password', async () => {
		const { email } = userInfo
		const login: ApiResponse<void> = await request(app).post("/v1/user/login").send({ email, password: "test" })

		expect(login.status).toBe(400)
		expect(login.body).toBe("Wrong password!")
	});

	it('should login user with login user with username', async () => {
		const { username, userhash, password } = userInfo
		const login: ApiResponse<void> = await request(app).post('/v1/user/login').send({ username, userhash, password })

		expect(login.status).toBe(200)
		expect(login.body.social_login).toBe(true)
		expect(login.body.refresh_token.length).toBeGreaterThan(10)
	});

	it('should not be able to login user with wrong username', async () => {
		const { userhash, password } = userInfo
		const login: ApiResponse<void> = await request(app).post("/v1/user/login").send({ username: "jest", userhash, password })

		expect(login.status).toBe(400)
		expect(login.body).toBe("Wrong username!")
	});

	it('should not be able to username login user with wrong password', async () => {
		const { username, userhash } = userInfo
		const login: ApiResponse<void> = await request(app).post('/v1/user/login').send({ username, userhash, password: "jest" })

		expect(login.status).toBe(400)
		expect(login.body).toBe("Wrong password!")
	});

	beforeAll(async () => await clear());
});
