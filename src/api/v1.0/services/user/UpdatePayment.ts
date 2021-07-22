import { Request } from 'express';

import { IPaymentRepository } from '@v1/repositories';
import { SqlitePaymentRepository } from '@v1/repositories/implementations';

import { Payment } from '@v1/entities';

class UpdatePaymentService {
	constructor(private paymentRepository: IPaymentRepository) {}

	async execute(user_id: string, { query }: Request, { card, method }: Payment) {
		try {
			const id = Number(query.id);

			const payment = await this.paymentRepository.update(id, { method, card, user_id });

			return {
				payment,
			};
		} catch (error) {
			console.log(error.message);
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const paymentRepository = new SqlitePaymentRepository();
	const UpdatePayment = new UpdatePaymentService(paymentRepository);

	const { payment } = await UpdatePayment.execute(request.params.id, request, request.body);

	return {
		status: 200,
		payment,
		message: 'Updated payment with success.',
	};
};
