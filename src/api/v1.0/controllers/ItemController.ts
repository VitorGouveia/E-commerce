import { Request, Response } from 'express';

import * as service from '@v1/services/item';

export const ItemController = {
	async create(request: Request, response: Response) {
		const { error, status, message, item } = await service.CreateItem(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
			item,
		});
	},

	async read(request: Request, response: Response) {
		const { error, status, message, items } = await service.ReadItem(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
			items,
		});
	},

	async update(request: Request, response: Response) {
		const { error, status, message, item } = await service.UpdateItem(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
			item,
		});
	},

	async delete(request: Request, response: Response) {
		const { error, status, message } = await service.DeleteItem(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},

	async rateItem(request: Request, response: Response) {
		const { error, status, message, item, average } = await service.RateItem(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
			average,
			item,
		});
	},

	async createImage(request: Request, response: Response) {
		const { error, status, message, image } = await service.CreateImage(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
			image,
		});
	},

	async removeImage(request: Request, response: Response) {
		const { error, status, message } = await service.DeleteImage(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},

	async getShipping(request: Request, response: Response) {
		const { error, status, message, shipping } = await service.getShipping(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(shipping);
	},
};
