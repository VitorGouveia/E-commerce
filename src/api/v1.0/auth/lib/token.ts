import { sign } from 'jsonwebtoken';

type userType = {
	id: string;
	token_version: number;
};

export const createToken = (
	{ id, token_version }: userType,
	expiresIn: string
) => {
	const JWT_ACCESS_TOKEN: string = String(process.env.JWT_ACCESS_TOKEN);

	const access_token = sign({ id, token_version }, JWT_ACCESS_TOKEN, {
		expiresIn,
	});

	return access_token;
};
