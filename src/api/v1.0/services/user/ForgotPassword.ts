import { Request } from 'express';
import { sign } from 'jsonwebtoken';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

import Queue from '@v1/config/queue';

class ForgotPasswordService {
	constructor(private usersRepository: IUsersRepository, private mailProvider: IMailProvider) {}

	async execute(id: string) {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

			const user = await this.usersRepository.findById(id);

			if (user == null || user.token_version == null || user.ip == null)
				throw new Error('Unexpected error.');

			await this.usersRepository.update({
				id: user.id,
				created_at: user.created_at,
				name: user.name,
				email: user.email,
				password: user.password,
				ip: user.ip,
				token_version: user.token_version + 1,
			});

			const newUser = await this.usersRepository.findById(id);

			const token = sign(
				{
					id: user.id,
					token_version: newUser.token_version,
				},
				access_token_secret,
				{ expiresIn: '7d' }
			);

			await Queue.add('ForgotPasswordMail', {
				user: {
					name: user.name,
					email: user.email,
				},
				token,
			});
		} catch (error) {
			if (error.message == 'FindUserById method failed.') {
				throw new Error('Cannot find user with that id.');
			}
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const UsersRepository = new SqliteUsersRepository();
	const MailProvider = new MailTrapMailProvider();
	const ForgotPassword = new ForgotPasswordService(UsersRepository, MailProvider);

	await ForgotPassword.execute(request.params.id);

	return {
		status: 200,
		message: 'Sent you an e-mail.',
	};
};
