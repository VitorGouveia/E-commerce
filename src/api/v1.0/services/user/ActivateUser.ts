import { Request } from 'express';
import { verify } from 'jsonwebtoken';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

import { User, randomNumber } from '@v1/entities';
import auth from '@v1/auth';

class ActivateUserService {
	constructor(private usersRepository: IUsersRepository, private mailRepository: IMailProvider) {}

	async activate(authHeader: string | undefined, ip: string) {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

			if (!authHeader) throw new Error('Token not found.');

			const token = authHeader && authHeader.split(' ')[1];
			if (!token) throw new Error('Your token must include Bearer');

			const { name, email, password }: any = verify(token, access_token_secret);

			const userAlreadyExists = await this.usersRepository.findByEmail(email);

			if (userAlreadyExists.length) throw new Error('User already exists.');

			ip = ip.slice(7);
			const user = new User({
				name,
				email,
				password,
				ip,
				shadow_ban: false,
				confirmed: true,
				ban: false,
				reason_for_ban: '',
				token_version: 0,
			});

			// searches for duplicate user name and hash
			const userHashAlreadyExists = await this.usersRepository.findUsername(
				user.name,
				user.userhash
			);

			if (userHashAlreadyExists.length) user.userhash = randomNumber(4);

			// store user
			await this.usersRepository.save(user);

			// create jwt
			const { id, token_version } = user;
			if (token_version == undefined) throw new Error('a');
			const access_token = auth.access_token({ id, token_version }, '24h');

			this.mailRepository.sendMail({
				to: {
					name,
					email,
				},
				from: {
					name: 'NeoExpensive Team',
					email: 'equipe@neoexpensive.com',
				},

				subject: `Welcome to NeoExpensive ${user.name}`,
				body: `<h1>Hi there ${user.name}, welcome!</h1>`,
			});

			return {
				access_token,
				user,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const UsersRepository = new SqliteUsersRepository();
		const MailProvider = new MailTrapMailProvider();

		const ActivateUser = new ActivateUserService(UsersRepository, MailProvider);

		const { user, access_token } = await ActivateUser.activate(
			request.headers['authorization'],
			request.ip
		);

		return {
			status: 201,
			user,
			access_token,
			message: 'User created with success!',
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
