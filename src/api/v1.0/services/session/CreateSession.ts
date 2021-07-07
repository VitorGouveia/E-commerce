import { Request } from 'express';

import { SqliteUsersRepository } from '@v1/repositories/implementations';
import { IUsersRepository } from '@v1/repositories';

import { verify, sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { isBanned } from '@v1/utils/IsBanned';

type loginRequestType = {
	email?: string;
	username?: string;
	userhash?: string;
	password: string;
};

class CreateSessionService {
	constructor(private usersRepository: IUsersRepository) {}

	async create(loginRequest: loginRequestType, authHeader: string | undefined) {
		try {
			// jwt refresh token secret
			const jwt_access_token = String(process.env.JWT_ACCESS_TOKEN);
			const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN);

			// jwt access token from headers
			const token = authHeader?.split(' ')[1];

			if (authHeader == undefined) throw new Error('No token was found');
			if (token == undefined)
				throw new Error(`
        Your token must include Bearer:\n
          example: 'Bearer <your_token>'
      `);

			// get information from authorization header
			const access_token = verify(token, jwt_access_token);
			const user = await this.usersRepository.findById(access_token['id']);
			if (user == null) {
				return {};
			}

			if (user.token_version !== access_token['token_version']) {
				throw new Error('Your session was invalidated.');
			}

			isBanned(user.ban, user.shadow_ban);

			const jwt_user = {
				id: access_token['id'],
				token_version: access_token['token_version'],
			};

			// giving the user a refresh token
			const refresh_token = sign(
				jwt_user, // embbeding user info in jwt
				jwt_refresh_token, // refresh token secret
				{ expiresIn: '168h' } // 7 days
			);

			return {
				jwt_login: true,
				refresh_token,
			};
		} catch (error) {
			if (error.message == 'Your session was invalidated.') {
				throw new Error('Your session was invalidated.');
			}

			const { username, userhash, email, password } = loginRequest;

			if (email == undefined) {
				const user = await this.usersRepository.findUsername(
					username,
					userhash
				);
				isBanned(user[0].ban, user[0].shadow_ban);
				if (user.length == 0) throw new Error('Wrong username!');

				const comparePassword = await compare(password, user[0].password);
				if (comparePassword != true) throw new Error('Wrong password!');

				const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN);

				const [{ id, token_version }] = user;
				const jwt_user = {
					id,
					token_version,
				};

				const refresh_token = sign(jwt_user, jwt_refresh_token, {
					expiresIn: '168h',
				});

				return {
					social_login: true,
					refresh_token,
				};
			}
			// searches user with input email
			const user = await this.usersRepository.findByEmail(email);
			isBanned(user[0].ban, user[0].shadow_ban);

			// if there isn't a user with input email
			if (user.length == 0) throw new Error('Wrong e-mail!');

			// compare from input password and database password
			const comparePassword = await compare(password, user[0].password);

			// if passwords do not match up
			if (comparePassword != true) throw new Error('Wrong password!');

			// if everything goes as normal
			// jwt refresh token secret
			const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN);

			const [{ id, name }] = user;
			const jwt_user = {
				id,
				token_version: user[0].token_version,
			};

			// giving the user a refresh token
			const refresh_token = sign(
				jwt_user, // embbeding user info in jwt
				jwt_refresh_token, // refresh token secret
				{ expiresIn: '168h' } // 7 days
			);

			return {
				social_login: true,
				refresh_token,
			};
		}
	}
}

export default async (request: Request) => {
	try {
		const UsersRepository = new SqliteUsersRepository();
		const CreateSession = new CreateSessionService(UsersRepository);

		const { refresh_token, jwt_login, social_login } =
			await CreateSession.create(
				request.body,
				request.headers['authorization']
			);

		return {
			jwt_login,
			social_login,
			status: 200,
			refresh_token,
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
