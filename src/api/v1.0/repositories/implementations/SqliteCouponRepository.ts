import { Coupon } from '@prisma/client';
import { ICouponRepository } from '@v1/repositories';

import { prisma } from '@src/prisma';

type listType = {
	item_id: number;
	code: string;
	expire_date: number;
	value: number;
};

export class SqliteCouponRepository implements ICouponRepository {
	async listAll(): Promise<Coupon[]> {
		const coupons = await prisma.coupon.findMany();
		return coupons;
	}

	async findByCode(code: string): Promise<Coupon> {
		const coupon = await prisma.coupon.findFirst({
			where: {
				code: {
					equals: code,
				},
			},
		});
		if (!coupon) throw new Error('Could not find that coupon.');
		return coupon;
	}

	async findByItemId(item_id: number): Promise<Coupon[]> {
		return await prisma.coupon.findMany({
			where: {
				item_id,
			},
		});
	}

	async findById(id: number): Promise<Coupon[]> {
		return await prisma.coupon.findMany({
			where: {
				id,
			},
		});
	}

	async list({ code, expire_date, item_id }: listType): Promise<Coupon[]> {
		const coupons = await prisma.coupon.findMany({
			where: {
				code,
				expire_date,
				item_id,
			},
			include: {
				item: true,
			},
		});

		return coupons;
	}

	async save({ value, code, expire_date, item_id }: listType): Promise<void> {
		await prisma.coupon.create({
			data: {
				value,
				code,
				expire_date,
				item_id,
			},
		});
	}

	async delete(id: number, item_id: number): Promise<void> {
		await prisma.coupon.deleteMany({
			where: {
				id,
				item_id,
			},
		});
	}
}
