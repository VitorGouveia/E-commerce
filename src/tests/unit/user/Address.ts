import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { app } from '@src/app';

import { Address } from '@v1/entities/Address';
import { prisma } from '@src/prisma';
import { ApiResponse } from '@src/tests/types/API';
import { User } from '@v1/entities';

var AddressDTO = {
	user_id: '',
	city: 'São Paulo',
	state: 'SP',
	number: 102,
	postal_code: '00000-000',
	street: 'test avenue',
};

var UserDTO = {
	name: 'test',
	email: 'test@test.com',
	password: '123',
	refresh_token: '',
};

export const AddressTest = () => {
	it('should create an address entity', async () => {
		const { city, state, number, postal_code, street } = AddressDTO;

		const address = new Address({
			user_id: '1',
			city,
			state,
			number,
			postal_code,
			street,
		});

		expect(address.city).toBe(city);
		expect(address.state).toBe(state);
		expect(address.number).toBe(number);
		expect(address.street).toBe(street);
	});

	it('should create an address', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
		const { city, state, number, postal_code, street } = AddressDTO;

		var token = sign(UserDTO, access_token_secret);
		token = `Bearer ${token}`;

		const {
			body: {
				user: { id },
				access_token,
			},
		}: ApiResponse<User> = await request(app).post('/v1/user/activate').set('authorization', token);
		AddressDTO.user_id = id;

		const {
			body: { refresh_token },
		}: ApiResponse<void> = await request(app)
			.post('/v1/user/login')
			.set('authorization', `Bearer ${access_token}`);

		UserDTO.refresh_token = refresh_token;

		const { status, body }: ApiResponse<Address> = await request(app)
			.post(`/v1/user/address/${id}`)
			.set('authorization', `Bearer ${refresh_token}`)
			.send({
				user_id: id,
				city,
				state,
				number,
				postal_code,
				street,
			});

		expect(status).toBe(201);
	});

	it('should delete an address', async () => {
		const { user_id } = AddressDTO;
		const { refresh_token } = UserDTO;

		const { status, body }: ApiResponse<User> = await request(app)
			.delete(`/v1/user/address/${AddressDTO.user_id}`)
			.set('authorization', `Bearer ${refresh_token}`)
			.send({ id: 1 });

		expect(status).toBe(202);
		expect(body).toBe('Address deleted with success!');

		await prisma.address.deleteMany({
			where: {
				user_id,
			},
		});
	});

	beforeAll(async () => {
		await prisma.user.deleteMany();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
	});
};
