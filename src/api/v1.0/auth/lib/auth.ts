import { createAccessToken, createRefreshToken, verifyToken } from './token';
import { emailLogin } from './email';
import { usernameLogin } from './username';

import { SqliteUsersRepository } from '@v1/repositories/implementations';

type info = {
	id: string;
	token_version: number;
};

type LoginType = {
	email?: string;
	username?: string;
	userhash?: string;
	password: string;
};

export const auth = {
	access_token({ id, token_version }: info, expiresIn: string) {
		const access_token = createAccessToken({ id, token_version }, expiresIn);

		return access_token;
	},

	refresh_token({ id, token_version }: info, expiresIn: string) {
		const refresh_token = createRefreshToken({ id, token_version }, expiresIn);

		return refresh_token;
	},

	verify(authHeader: string | undefined, type: 'access' | 'refresh') {
		if (authHeader == undefined) throw new Error('Token not supplied to auth lib.');

		const token = authHeader && authHeader.split(' ')[1];

		if (!token) throw new Error('Your token must include Bearer.');

		const payload = verifyToken(token, type);

		return payload;
	},

	async loginEmail({ email, password }: LoginType) {
		if (email == undefined) throw new Error('a');
		const UsersRepository = new SqliteUsersRepository();
		const EmailLogin = new emailLogin(UsersRepository);
		const { user, matchPassword, failed_too_many } = await EmailLogin.handle(email, password);

		return {
			user,
			matchPassword,
			failed_too_many,
		};
	},

	async loginUsername({ username, userhash, password }: LoginType) {
		if (username == undefined || userhash == undefined) return {};

		const UsersRepository = new SqliteUsersRepository();
		const UsernameLogin = new usernameLogin(UsersRepository);
		const { user, failed_too_many, matchPassword } = await UsernameLogin.handle(
			username,
			userhash,
			password
		);

		return {
			user,
			failed_too_many,
			matchPassword,
		};
	},
};
