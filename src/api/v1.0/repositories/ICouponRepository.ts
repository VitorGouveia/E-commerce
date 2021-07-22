import { Coupon } from '@prisma/client';

type listType = {
	id?: number;
	item_id?: number;
	code?: string;
	expire_date?: number;
	value?: number;
};

export interface ICouponRepository {
	listAll(): Promise<Coupon[]>;
	findByCode(code: string): Promise<Coupon>;
	findByItemId(item_id: number): Promise<Coupon[]>;
	findById(id: number): Promise<Coupon[]>;
	list({ id, item_id, expire_date, code }: listType): Promise<Coupon[]>;
	save({ item_id, expire_date, code }: listType): Promise<void>;
	delete(id: number, item_id: number): Promise<void>;
}
