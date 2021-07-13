import { Image } from '@v1/entities';

describe('Image entity', () => {
	it('should create an image entity', () => {
		const imageDTO = {
			item_id: 0,
			link: 'www.test.com/img',
		};

		const image = new Image(imageDTO);

		expect(image).toBeTruthy();

		expect(image.item_id).toBe(imageDTO.item_id);
		expect(image.link).toBe(imageDTO.link);
	});
});
