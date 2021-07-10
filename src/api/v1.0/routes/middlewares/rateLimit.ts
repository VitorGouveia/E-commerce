import rateLimit from 'express-rate-limit';

export const CreateUserRateLimiter = () =>
	rateLimit({
		windowMs: 60 * 60 * 1000, // 1 hour window
		max: 10, // max requests
		message: 'Too many accounts created from this IP, please try again after an hour',
	});

export const UpdateUserRateLimiter = () =>
	rateLimit({
		windowMs: 60 * 60 * 1000, // 1 hour window
		max: 15,
		message: 'Too many updates made from this IP, please try again later.',
	});
