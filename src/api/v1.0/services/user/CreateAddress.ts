import { Request } from 'express';

import { IAddressRepository } from '@v1/repositories';
import { SqliteAddressRepository } from '@v1/repositories/implementations';

import { Address } from '@v1/entities';

class CreateAddressService {
	constructor(private addressRepository: IAddressRepository) {}

	async create(addressRequest: Address, id: string) {
		try {
			if (!id) throw new Error('a user id is required to create an address');

			const { city, number, postal_code, state, street } = addressRequest;

			const address = new Address({
				user_id: id,
				city,
				number,
				postal_code,
				state,
				street,
			});

			await this.addressRepository.save(address);

			return {
				address,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const AddressRepository = new SqliteAddressRepository();
		const CreateAddress = new CreateAddressService(AddressRepository);

		const { address } = await CreateAddress.create(request.body, request.params.id);

		return {
			status: 201,
			address,
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
