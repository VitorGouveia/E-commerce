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
};

export const CreateAddressTest = () => {
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

	it('should create address', async () => {
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

		const { status, body }: ApiResponse<Address> = await request(app)
			.post(`/v1/user/address`)
			.set('authorization', `Bearer ${refresh_token}`)
			.send({
				user_id: id,
				city,
				state,
				number,
				postal_code,
				street,
			});
		console.log(body);

		expect(status).toBe(201);
	});

	beforeAll(async () => {
		await prisma.user.deleteMany();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
	});
};
