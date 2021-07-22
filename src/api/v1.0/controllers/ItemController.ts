import { Request, Response } from 'express';

import * as service from '@v1/services/item';

export const ItemController = {
	async create(request: Request, response: Response) {
		const { status, message, item } = await service.CreateItem(request);

		return response.status(status).json({
			message,
			item,
		});
	},

	async read(request: Request, response: Response) {
		const { status, message, items } = await service.ReadItem(request);

		return response.status(status).json({
			message,
			items,
		});
	},

	async update(request: Request, response: Response) {
		const { status, message, item } = await service.UpdateItem(request);

		return response.status(status).json({
			message,
			item,
		});
	},

	async delete(request: Request, response: Response) {
		const { status, message } = await service.DeleteItem(request);

		return response.status(status).json(message);
	},

	async rateItem(request: Request, response: Response) {
		const { status, message, item, average } = await service.RateItem(request);

		return response.status(status).json({
			message,
			average,
			item,
		});
	},

	async createImage(request: Request, response: Response) {
		const { status, message, image } = await service.CreateImage(request);

		return response.status(status).json({
			message,
			image,
		});
	},

	async removeImage(request: Request, response: Response) {
		const { status, message } = await service.DeleteImage(request);

		return response.status(status).json(message);
	},

	async getShipping(request: Request, response: Response) {
		const { status, shipping } = await service.getShipping(request);

		return response.status(status).json(shipping);
	},
};
