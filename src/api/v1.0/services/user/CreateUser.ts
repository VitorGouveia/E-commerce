import { Request } from 'express';
import { sign } from 'jsonwebtoken';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

import { User } from '@v1/entities';

// create user service is responsible for authentication and some rules
class CreateUserService {
	constructor(private usersRepository: IUsersRepository, private mailProvider: IMailProvider) {}

	async create({ name, email, password }: User) {
		try {
			const access_token = String(process.env.JWT_ACCESS_TOKEN);

			// searches users with that e-mail
			const userAlreadyExists = await this.usersRepository.findByEmail(email);

			// if user with same email exists
			if (userAlreadyExists.length) throw new Error('User already exists.');

			const token = sign(
				{
					name,
					email,
					password,
				},
				access_token,
				{ expiresIn: '15m' }
			);

			await this.mailProvider.sendMail({
				to: {
					name,
					email,
				},
				from: {
					name: 'NeoExpensive Team',
					email: 'equipe@neoexpensive.com',
				},
				subject: 'Verification e-mail.',
				body: `<p>Your verification token is ${token}</p>`,
			});
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

// just return everything from create user service
export default async (request: Request) => {
	try {
		const UsersRepository = new SqliteUsersRepository();
		const MailProvider = new MailTrapMailProvider();
		const CreateUser = new CreateUserService(UsersRepository, MailProvider);

		await CreateUser.create(request.body);

		// respond with user information
		return {
			status: 200,
			message: 'Sent verification message to your e-mail!',
		};
	} catch (error) {
		// in case of error, send error details
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
