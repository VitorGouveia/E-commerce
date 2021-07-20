export class Order {
	public user_id: string;
	public address_id: number;
	public item_id: number;
	public payment_id: number;

	public shipping_price: number;
	public all_items_price: number;

	constructor(props: Order) {
		Object.assign(this, props);
	}
}
