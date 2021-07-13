import {
	createAccessToken,
	createAdminAccessToken,
	createAdminRefreshToken,
	createRefreshToken,
	verifyToken,
} from './token';
import { emailLogin } from './email';
import { usernameLogin } from './username';

import { SqliteUsersRepository } from '@v1/repositories/implementations';

type info = {
	id: string;
	token_version: number;
};

type LoginEmailType = {
	email: string | null;
	password: string;
};

type LoginUsernameType = {
	username: string | null;
	userhash: string | null;
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
	 * Creates an access_token for admin users.
	 * @function admin_access
	 */
	admin_access({ id, token_version }: info, expiresIn: string) {
		const access_token = createAdminAccessToken({ id, token_version }, expiresIn);

		return access_token;
	},

	/**
	 * Create a refresh_token for admin users.
	 * @function refresh_token
	 */
	admin_refresh({ id, token_version }: info, expiresIn: string) {
		const refresh_token = createAdminRefreshToken({ id, token_version }, expiresIn);

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
	async loginEmail({ email, password }: LoginEmailType) {
		if (email == null) throw new Error('Could not find an e-mail to auth.');
		const UsersRepository = new SqliteUsersRepository();
		const EmailLogin = new emailLogin(UsersRepository);
		const { user, failed_too_many, matchPassword } = await EmailLogin.handle(email, password);

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
	async loginUsername({ username, userhash, password }: LoginUsernameType) {
		if (username == null || userhash == null)
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
