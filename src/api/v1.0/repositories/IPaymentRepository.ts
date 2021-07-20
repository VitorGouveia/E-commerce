import { Payment } from '@v1/entities';

export interface IPaymentRepository {
	save(payment: Payment): Promise<void>;
	delete(id: number): Promise<void>;
}
