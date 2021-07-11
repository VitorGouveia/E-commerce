import request from 'supertest';
import { app } from '@src/app';

import user from './users.json';
import { prisma } from '@src/prisma';
import { User } from '@v1/entities';
import { ApiResponse } from '@tests/types/API';

export const loadFileTest = () => {
	it('should load admin users from file', async () => {
		await prisma.user.deleteMany();

		const { status, body }: ApiResponse<User> = await request(app)
			.post('/v1/user/admin')
			.send(user);

		expect(body.user).toHaveProperty('id');
		expect(body.message).toBe('Loaded admin users from file.');
		expect(status).toBe(200);
	});

	it('should fail to load admin users from file', async () => {
		const { status, body }: ApiResponse<User> = await request(app)
			.post('/v1/user/admin')
			.send(user);

		expect(status).toBe(400);
		expect(body).toBe('This user already exists or have already been loaded.');
	});
};
