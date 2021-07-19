import { Request, Response } from 'express';

import * as service from '@v1/services/user';

export const UserController = {
	async create(request: Request, response: Response) {
		const { error, status, message } = await service.CreateUser(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},

	async read(request: Request, response: Response) {
		const { error, message, status, users } = await service.ReadUser(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
			users,
		});
	},

	async update(request: Request, response: Response) {
		const { error, message, status, available_usernames, user } = await service.UpdateUser(request);

		if (error)
			return response.status(status).json({
				message,
				available_usernames,
			});

		return response.status(status).json({
			message,
			user,
		});
	},

	async delete(request: Request, response: Response) {
		const { error, status, message } = await service.DeleteUser(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
		});
	},

	async createAddress(request: Request, response: Response) {
		const { error, status, message, address } = await service.CreateAddress(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({
			message,
			address,
		});
	},

	async deleteAddress(request: Request, response: Response) {
		const { error, status, message } = await service.DeleteAddress(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},

	async createCart(request: Request, response: Response) {
		const { error, status, message } = await service.CreateCart(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},

	async deleteCart(request: Request, response: Response) {
		const { error, status, message } = await service.DeleteCart(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},

	async activate(request: Request, response: Response) {
		const { error, status, message, user, access_token } = await service.ActivateUser(request);

		if (error) return response.status(status).json(message);

		response.header('authorization', access_token);

		return response.status(status).json({
			message,
			user,
			access_token,
		});
	},

	async forgotPassword(request: Request, response: Response) {
		const { error, status, message } = await service.ForgotPassword(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},

	async createPayment(request: Request, response: Response) {
		const { error, status, message, payment } = await service.CreatePayment(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json({ message, payment });
	},

	async checkout(request: Request, response: Response) {
		const { error, status, message } = await service.Checkout(request);

		if (error) return response.status(status).json(message);

		return response.status(status).json(message);
	},
};
