import { Rating } from '@v1/entities';

describe('Rating entity', () => {
	it('should create a rating entity', () => {
		const ratingDTO: Rating = {
			item_id: 1,
			one_star: 1,
			two_star: 1,
			three_star: 1,
			four_star: 1,
			five_star: 1,
			average: 0,
			message: 'Test message.',
		};

		const rating = new Rating(ratingDTO, ratingDTO.item_id);

		expect(rating).toBeTruthy();

		expect(rating.item_id).toBe(ratingDTO.item_id);
		expect(rating.one_star).toBe(ratingDTO.one_star);
		expect(rating.two_star).toBe(ratingDTO.two_star);
		expect(rating.three_star).toBe(ratingDTO.three_star);
		expect(rating.four_star).toBe(ratingDTO.four_star);
		expect(rating.five_star).toBe(ratingDTO.five_star);
	});
});
