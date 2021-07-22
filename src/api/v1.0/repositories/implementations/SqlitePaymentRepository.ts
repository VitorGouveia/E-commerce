import { IPaymentRepository } from '@v1/repositories';

import { Payment } from '@v1/entities';
import { Payment as PaymentType } from '@prisma/client';

import { prisma } from '@src/prisma';

export class SqlitePaymentRepository implements IPaymentRepository {
	async save(payment: Payment): Promise<void> {
		const { user_id, card, method } = payment;
		const { brand, code, month, year, number } = card;

		await prisma.payment.create({
			data: {
				user_id,
				method,
				card_brand: brand,
				card_code: code,
				card_month: month,
				card_number: number,
				card_year: year,
			},
		});
	}

	async update(id: number, { card, method, user_id }: Payment): Promise<PaymentType> {
		const { brand, code, month, number, year } = card;

		const payment = await prisma.payment.update({
			where: {
				id,
			},
			data: {
				card_year: year,
				card_number: number,
				card_month: month,
				card_code: code,
				card_brand: brand,
				method,
				user_id,
			},
		});

		return payment;
	}

	async delete(id: number, user_id: string): Promise<void> {
		await prisma.payment.deleteMany({
			where: {
				id,
				user_id,
			},
		});
	}
}
