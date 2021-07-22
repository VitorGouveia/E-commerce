import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
	error: Error,
	request: Request,
	response: Response,
	next: NextFunction
) => {
	var status: number = 0;
	const isNotFound = String(error.message).match(/found|find/);

	status = 400;
	if (!!isNotFound) {
		console.log(error.message);
		status = 404;
	}

	return response.status(status).json({
		message: error.message,
	});
};
