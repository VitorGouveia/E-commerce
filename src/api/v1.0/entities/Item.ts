import { Rating, Image, Dimension, Coupon } from '.';

export class Item {
	public readonly created_at: number;

	public name: string;
	public short_name: string;
	public description: string;

	public price: number;
	public shipping_price: number;
	public discount: number;

	public category: string;

	public image: Image[];
	public rating: Rating[];
	public dimension: Dimension;
	public coupon: Coupon[];

	constructor(props: Item, image?: Image[]) {
		this.created_at = Date.now();
		if (image) {
			this.image = image;
		}
		Object.assign(this, props);
	}
}
