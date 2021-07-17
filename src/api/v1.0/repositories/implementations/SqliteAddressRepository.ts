import { Address } from '@v1/entities';
import { IAddressRepository } from '@v1/repositories';

import { prisma } from '@src/prisma';

export class SqliteAddressRepository implements IAddressRepository {
	async save(address: Address): Promise<void> {
		const { ...props } = address;

		await prisma.address.create({
			data: {
				...props,
			},
		});
	}

	async delete(id: number, user_id: string): Promise<void> {
		await prisma.address.deleteMany({
			where: {
				id,
				user_id,
			},
		});
	}
}
