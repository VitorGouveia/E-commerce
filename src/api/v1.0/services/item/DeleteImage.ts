import { Request } from 'express';

import { IImageRepository } from '@v1/repositories';
import { SqliteImageRepository } from '@v1/repositories/implementations';

class DeleteImageService {
	constructor(private imageRepository: IImageRepository) {}

	async execute({ id }: any, item_id: number) {
		try {
			await this.imageRepository.delete(Number(id), item_id);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const ImageRepository = new SqliteImageRepository();
	const DeleteImage = new DeleteImageService(ImageRepository);

	await DeleteImage.execute(request.body, Number(request.params.id));

	return {
		status: 200,
		message: 'Deleted item image with success!',
	};
};
