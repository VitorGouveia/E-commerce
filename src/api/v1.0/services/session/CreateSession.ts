import { Request } from 'express';

import { SqliteUsersRepository } from '@v1/repositories/implementations';
import { IUsersRepository } from '@v1/repositories';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

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
	constructor(private usersRepository: IUsersRepository, private mailProvider: IMailProvider) {}

	async create(loginRequest: loginRequestType, authHeader: string | undefined) {
		try {
			// jwt refresh token secret
			const jwt_access_token = String(process.env.JWT_ACCESS_TOKEN);
			const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN);

			if (authHeader == undefined) throw new Error('No token was found.');
			// jwt access token from headers
			const token = authHeader && authHeader.split(' ')[1];

			if (token == undefined) throw new Error(`Your token must include Bearer`);

			// get information from authorization header
			const { id, token_version }: any = verify(token, jwt_access_token);

			const user = await this.usersRepository.findById(id);

			if (user && user.confirmed == false) throw new Error('Activate your account first.');

			if (user == null) throw new Error("User with payload id doesn't exist.");

			if (user.token_version !== token_version) throw new Error('Your session was invalidated.');

			isBanned(user.ban, user.shadow_ban);

			const jwt_info = {
				id,
				token_version,
			};

			// giving the user a refresh token
			const refresh_token = sign(
				jwt_info, // embbeding user info in jwt
				jwt_refresh_token, // refresh token secret
				{ expiresIn: '168h' } // 7 days
			);

			return {
				jwt_login: true,
				refresh_token,
			};
		} catch (error) {
			if (error.message == 'Your session was invalidated.') {
				throw new Error(error.message);
			}

			const { username, userhash, email, password } = loginRequest;

			if (email == undefined) {
				const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN);

				// find user
				const [user] = await this.usersRepository.findUsername(username, userhash);

				if (!user) throw new Error('Wrong username!');

				if (user.failed_attemps && user.failed_attemps >= 5) {
					const { id, created_at, name, email, password, token_version } = user;

					if (token_version == null) return {};

					await this.usersRepository.update({
						id,
						created_at,
						name,
						email,
						password,
						failed_attemps: 0,
						token_version: token_version + 1,
					});

					await this.mailProvider.sendMail({
						to: {
							name,
							email,
						},
						from: {
							name: 'NeoExpensive Team',
							email: 'equipe@neoexpensive.com',
						},

						subject: `${user.failed_attemps} Failed login attemps were made to your account ${user.name}.`,
						body: `<p>${user.name} contact us if it wasn't trying to login.</p>`,
					});

					throw new Error(
						'You failed to login more than 5 times, we sent you a confirmation e-mail.'
					);
				}

				// check if user is banned
				isBanned(user.ban, user.shadow_ban);
				const { id, created_at, name, token_version, failed_attemps } = user;

				const comparePassword = await compare(password, user.password);
				if (comparePassword != true) {
					if (failed_attemps == null) return {};

					await this.usersRepository.update({
						id,
						created_at,
						name,
						email: user.email,
						password: user.password,
						failed_attemps: failed_attemps + 1,
					});

					throw new Error('Wrong password!');
				}

				await this.usersRepository.update({
					id,
					created_at,
					name,
					email: user.email,
					password: user.password,
					failed_attemps: 0,
				});

				const refresh_token = sign({ id, token_version }, jwt_refresh_token, {
					expiresIn: '168h',
				});

				return {
					social_login: true,
					refresh_token,
				};
			}
			// searches user with input email
			const [user] = await this.usersRepository.findByEmail(email);

			// if there isn't a user with input email
			if (!user) throw new Error('Wrong e-mail!');

			// check if user failed login 5 or more times consecutively
			if (user.failed_attemps && user.failed_attemps >= 5) {
				const { id, created_at, name, email, password, token_version } = user;

				if (token_version == null) return {};

				await this.usersRepository.update({
					id,
					created_at,
					name,
					email,
					password,
					failed_attemps: 0,
					token_version: token_version + 1,
				});

				await this.mailProvider.sendMail({
					to: {
						name,
						email,
					},
					from: {
						name: 'NeoExpensive Team',
						email: 'equipe@neoexpensive.com',
					},

					subject: `${user.failed_attemps} Failed login attemps were made to your account ${user.name}.`,
					body: `<p>${user.name} contact us if it wasn't trying to login.</p>`,
				});

				throw new Error(
					'You failed to login more than 5 times, we sent you a confirmation e-mail.'
				);
			}

			// check if user is banned
			isBanned(user.ban, user.shadow_ban);
			const { id, created_at, name, token_version, failed_attemps } = user;

			// compare from input password and database password
			const comparePassword = await compare(password, user.password);
			// if passwords do not match up
			if (comparePassword != true) {
				if (failed_attemps == null) return {};
				await this.usersRepository.update({
					id,
					created_at,
					name,
					email: user.email,
					password: user.password,
					failed_attemps: failed_attemps + 1,
				});

				throw new Error('Wrong password!');
			}

			await this.usersRepository.update({
				id,
				created_at,
				name,
				email: user.email,
				password: user.password,
				failed_attemps: 0,
			});

			// if everything goes as normal
			// jwt refresh token secret
			const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN);
			const jwt_user = {
				id,
				token_version,
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
		const MailProvider = new MailTrapMailProvider();
		const CreateSession = new CreateSessionService(UsersRepository, MailProvider);

		const { refresh_token, jwt_login, social_login } = await CreateSession.create(
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
