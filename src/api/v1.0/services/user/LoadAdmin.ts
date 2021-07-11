import { Request } from 'express';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User } from '@v1/entities';
import auth from '@v1/auth';

class LoadAdminService {
	constructor(private usersRepository: IUsersRepository) {}

	async load(users: User[]) {
		try {
			for (let user of users) {
				const userAlreadyExists = await this.usersRepository.findByEmail(user.email);

				if (userAlreadyExists.length)
					throw new Error('This user already exists or have already been loaded.');

				const newUser = new User(user, {
					admin: {
						username: user.username,
						userhash: user.userhash,
					},
				});

				const { id, token_version } = newUser;

				if (token_version == undefined) throw new Error('');

				const access_token = auth.admin_access({ id, token_version }, '24h');

				await this.usersRepository.save(newUser);

				return {
					user: {
						id: newUser.id,
						email: newUser.email,
						access_token,
					},
				};
			}
		} catch (error) {
			throw new Error(error.message);
			return error;
		}
	}
}

export default async (request: Request) => {
	try {
		const usersRepository = new SqliteUsersRepository();
		const LoadAdmin = new LoadAdminService(usersRepository);

		const { user } = await LoadAdmin.load(request.body);

		return {
			status: 200,
			user,
			message: 'Loaded admin users from file.',
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
