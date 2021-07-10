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
	/**
	 * Creates an acess_token
	 * @function access_token
	 */
	access_token({ id, token_version }: info, expiresIn: string) {
		const access_token = createAccessToken({ id, token_version }, expiresIn);

		return access_token;
	},

	/**
	 * Creates a refesh_token
	 * @function refresh_token
	 */
	refresh_token({ id, token_version }: info, expiresIn: string) {
		const refresh_token = createRefreshToken({ id, token_version }, expiresIn);

		return refresh_token;
	},

	/**
	 * Verify and decodes a JWT token
	 * @function verify
	 */
	verify(authHeader: string | undefined, type: 'access' | 'refresh') {
		if (authHeader == undefined) throw new Error('Token not supplied to auth lib.');

		const token = authHeader && authHeader.split(' ')[1];

		if (!token) throw new Error('Your token must include Bearer.');

		const payload = verifyToken(token, type);

		return payload;
	},

	/**
	 * Login with e-mail service
	 * @function loginEmail
	 */
	async loginEmail({ email, password }: LoginType) {
		if (email == undefined) throw new Error('Could not find an e-mail to auth.');
		const UsersRepository = new SqliteUsersRepository();
		const EmailLogin = new emailLogin(UsersRepository);
		const { user, matchPassword, failed_too_many } = await EmailLogin.handle(email, password);

		return {
			user,
			matchPassword,
			failed_too_many,
		};
	},

	/**
	 * Login with username
	 * @function loginUsername
	 */
	async loginUsername({ username, userhash, password }: LoginType) {
		if (username == undefined || userhash == undefined)
			throw new Error('Could not find an username and userhash to auth.');

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
