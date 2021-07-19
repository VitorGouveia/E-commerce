export class Rating {
	public readonly item_id: number;

	public average: number;
	public one_star: number;
	public two_star: number;
	public three_star: number;
	public four_star: number;
	public five_star: number;
	public message: string;

	constructor(props: Rating, id: number) {
		Object.assign(this, props);
		this.item_id = id;
	}
}
