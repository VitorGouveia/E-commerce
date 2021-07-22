import { Request } from 'express';

import { IImageRepository } from '@v1/repositories';
import { SqliteImageRepository } from '@v1/repositories/implementations';

import { Image } from '@v1/entities';

class CreateImageService {
	constructor(private imageRepository: IImageRepository) {}

	async execute(id: number, createImageRequest: Image) {
		try {
			const image = new Image(createImageRequest);

			await this.imageRepository.save(id, image);

			return {
				image,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const ImageRepository = new SqliteImageRepository();
	const CreateImage = new CreateImageService(ImageRepository);

	const { image } = await CreateImage.execute(Number(request.params.id), request.body);

	return {
		status: 200,
		message: 'Create item image with success!',
		image,
	};
};
