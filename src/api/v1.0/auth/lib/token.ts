import { sign } from 'jsonwebtoken';

type userType = {
	id: string;
	token_version: number;
};

export const createToken = (user: userType, expiresIn: string) => {
	const JWT_ACCESS_TOKEN: string = String(process.env.JWT_ACCESS_TOKEN);

	const access_token = sign(user, JWT_ACCESS_TOKEN, {
		expiresIn,
	});

	return access_token;
};
