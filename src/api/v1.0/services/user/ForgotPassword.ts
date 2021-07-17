import { Request } from 'express';
import { sign } from 'jsonwebtoken';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

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

			const access_token = sign(
				{
					id: user.id,
					token_version: newUser.token_version,
				},
				access_token_secret,
				{ expiresIn: '7d' }
			);

			await this.mailProvider.sendMail({
				to: {
					name: user.name,
					email: user.email,
				},
				from: {
					name: 'NeoExpensive Team',
					email: 'equipe@neoexpensive.com',
				},
				subject: 'Forgot password.',
				body: `<p>You forgot your password? No trouble, use this token:\n ${access_token}</p>`,
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
	try {
		const UsersRepository = new SqliteUsersRepository();
		const MailProvider = new MailTrapMailProvider();
		const ForgotPassword = new ForgotPasswordService(UsersRepository, MailProvider);

		await ForgotPassword.execute(request.params.id);

		return {
			status: 200,
			message: 'Sent you an e-mail.',
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
