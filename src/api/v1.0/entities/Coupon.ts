export class Coupon {
	public id?: number;

	public item_id: number;
	public code: string;
	public expire_date: number;
	public value: number;

	constructor(props: Coupon) {
		Object.assign(this, props);
	}
}
