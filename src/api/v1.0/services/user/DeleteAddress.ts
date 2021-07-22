import { Request } from 'express';

import { IAddressRepository } from '@v1/repositories';
import { SqliteAddressRepository } from '@v1/repositories/implementations';

class DeleteAddressService {
	constructor(private addressRepository: IAddressRepository) {}

	async execute({ id }, user_id: string) {
		try {
			await this.addressRepository.delete(id, user_id);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const AddressRepository = new SqliteAddressRepository();
	const CreateAddress = new DeleteAddressService(AddressRepository);

	await CreateAddress.execute(request.body, request.params.id);

	return {
		status: 202,
		message: 'Address deleted with success!',
	};
};
