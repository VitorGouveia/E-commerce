import { Payment } from '@v1/entities';
import { Payment as PaymentType } from '@prisma/client';

export interface IPaymentRepository {
	save(payment: Payment): Promise<void>;
	update(id: number, payment: Payment): Promise<PaymentType>;
	delete(id: number, user_id: string): Promise<void>;
}
