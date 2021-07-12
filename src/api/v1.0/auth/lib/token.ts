import { JwtPayload, sign, verify } from 'jsonwebtoken';

type userType = {
	id: string;
	token_version: number;
};

export const createAccessToken = (info: userType, expiresIn: string) => {
	const access_token_secret: string = String(process.env.JWT_ACCESS_TOKEN);

	const access_token = sign(info, access_token_secret, { expiresIn });
	return access_token;
};

export const createRefreshToken = (info: userType, expiresIn: string) => {
	const refresh_token_secret: string = String(process.env.JWT_REFRESH_TOKEN);

	const refresh_token = sign(info, refresh_token_secret, { expiresIn });
	return refresh_token;
};

export const createAdminAccessToken = (info: userType, expiresIn: string) => {
	const access_token_secret: string = String(process.env.DASH_ACCESS_TOKEN);

	const access_token = sign(info, access_token_secret, { expiresIn });
	return access_token;
};

export const createAdminRefreshToken = (info: userType, expiresIn: string) => {
	const refresh_token_secret: string = String(process.env.DASH_REFRESH_TOKEN);

	const refresh_token = sign(info, refresh_token_secret, { expiresIn });
	return refresh_token;
};

export const verifyToken = (token: string, type: string): string | JwtPayload => {
	const access_token_secret: string = String(process.env.JWT_ACCESS_TOKEN);
	const refresh_token_secret: string = String(process.env.JWT_REFRESH_TOKEN);

	if (type == 'access') {
		const payload = verify(token, access_token_secret);

		return payload;
	}

	const payload = verify(token, refresh_token_secret);

	return payload;
};

const token = {
	createAccessToken,
	createRefreshToken,
	createAdminAccessToken,
	createAdminRefreshToken,
	verifyToken,
};

export default token;
