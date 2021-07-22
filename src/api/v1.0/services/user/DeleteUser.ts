import { Request, urlencoded } from 'express';

import { SqliteUsersRepository } from '@v1/repositories/implementations';
import { IUsersRepository } from '@v1/repositories';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

import Queue from '@v1/config/queue';

class DeleteUserService {
	constructor(private usersRepository: IUsersRepository, private mailProvider: IMailProvider) {}

	async execute(id: string) {
		try {
			const user = await this.usersRepository.findById(id);

			if (user == null) {
				throw new Error('user with this id not found.');
			}

			await this.usersRepository.delete(id);

			await Queue.add('DeletionMail', {
				user: {
					name: user.name,
					email: user.email,
				},
			});
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const UsersRepository = new SqliteUsersRepository();
	const MailProvider = new MailTrapMailProvider();
	const DeleteUser = new DeleteUserService(UsersRepository, MailProvider);

	await DeleteUser.execute(request.params.id);

	return {
		status: 200,
		message: 'User deleted with success',
	};
};
