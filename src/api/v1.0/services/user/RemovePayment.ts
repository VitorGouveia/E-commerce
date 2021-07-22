import { Request } from 'express';

import { IPaymentRepository } from '@v1/repositories';
import { SqlitePaymentRepository } from '../../repositories/implementations';

class RemovePaymentService {
	constructor(private paymentRepository: IPaymentRepository) {}

	async execute(user_id: string, { query }: Request) {
		try {
			const id = query.id;

			await this.paymentRepository.delete(Number(id), user_id);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const paymentRepository = new SqlitePaymentRepository();
	const RemovePayment = new RemovePaymentService(paymentRepository);

	await RemovePayment.execute(request.params.id, request);

	return {
		status: 200,
		message: 'Removed payment.',
	};
};
