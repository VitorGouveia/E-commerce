import { Request } from 'express';
import { compare } from 'bcrypt';
import { verify, sign } from 'jsonwebtoken';

import { SqliteUsersRepository } from '@v1/repositories/implementations';
import { IUsersRepository } from '@v1/repositories';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

import { isBanned } from '@v1/utils/IsBanned';
import auth from '@v1/auth';

type loginRequestType = {
	email?: string;
	username?: string;
	userhash?: string;
	password: string;
};

class CreateSessionService {
	constructor(private usersRepository: IUsersRepository, private mailProvider: IMailProvider) {}

	async create(loginRequest: loginRequestType, authHeader: string | undefined, ip: string) {
		try {
			const { id, token_version }: any = auth.verify(authHeader, 'access');

			const user = await this.usersRepository.findById(id);

			if (user.ip == null) throw new Error('IP not provided.');
			ip = ip.slice(7);
			const compareIPs = await compare(ip, user.ip);

			if (compareIPs == false) {
				await this.mailProvider.sendMail({
					to: {
						name: user.name,
						email: user.email,
					},
					from: {
						name: 'NeoExpensive Team',
						email: 'equipe@neoexpensive.com',
					},

					subject: `You logged in from a different IP!.`,
					body: `
						<p>${user.name} is this your ip: ${user.ip}</p>
					`,
				});
			}

			if (user == null) throw new Error("User with payload id doesn't exist.");

			if (user && user.confirmed == false) throw new Error('Activate your account first.');

			isBanned(user.ban, user.shadow_ban);

			if (user.token_version !== token_version) throw new Error('Your session was invalidated.');

			// giving the user a refresh token
			const token = auth.refresh_token({ id, token_version }, '7d');

			return {
				jwt_login: true,
				refresh_token: token,
			};
		} catch (error) {
			if (error.message == 'Your banned. If you think this is a mistake contact our team.') {
				throw new Error(error.message);
			}
			if (error.message == "Sorry, we couldn't complete your request, please try again later.") {
				throw new Error(error.message);
			}
			if (error.message == 'Your session was invalidated.') {
				throw new Error(error.message);
			}

			if (loginRequest.email == undefined) {
				// find user
				const { user, failed_too_many, matchPassword } = await auth.loginUsername(loginRequest);

				if (failed_too_many) {
					const { name, email, failed_attemps } = user;

					await this.usersRepository.update(user);

					await this.mailProvider.sendMail({
						to: {
							name,
							email,
						},
						from: {
							name: 'NeoExpensive Team',
							email: 'equipe@neoexpensive.com',
						},

						subject: `${failed_attemps} Failed login attemps were made to your account ${name}.`,
						body: `<p>${name} contact us if it wasn't trying to login.</p>`,
					});

					throw new Error(
						'You failed to login more than 5 times, we sent you a confirmation e-mail.'
					);
				}

				if (matchPassword) {
					await this.usersRepository.update(user);

					throw new Error('Wrong password!');
				}

				if (user == null) return {};

				const { id, token_version } = user;

				await this.usersRepository.update(user);
				const token = auth.refresh_token({ id, token_version }, '7d');

				return {
					social_login: true,
					refresh_token: token,
				};
			}

			const { user, matchPassword, failed_too_many } = await auth.loginEmail(loginRequest);
			if (!user) throw new Error('Could not find an user.');

			if (failed_too_many == true) {
				const { name, email, failed_attemps } = user;

				await this.usersRepository.update(user);

				await this.mailProvider.sendMail({
					to: {
						name,
						email,
					},
					from: {
						name: 'NeoExpensive Team',
						email: 'equipe@neoexpensive.com',
					},

					subject: `${failed_attemps} Failed login attemps were made to your account ${name}.`,
					body: `
						<p>${name} contact us if it wasn't trying to login.</p>
						<button>Click here to end all your active sessions</button>
					`,
				});

				throw new Error(
					'You failed to login more than 5 times, we sent you a confirmation e-mail.'
				);
			}

			if (matchPassword == true) {
				await this.usersRepository.update(user);

				throw new Error('Wrong password!');
			}

			const { id, token_version } = user;

			await this.usersRepository.update(user);

			const token = auth.refresh_token({ id, token_version }, '7d');

			return {
				social_login: true,
				refresh_token: token,
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
			request.headers['authorization'],
			request.ip
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
