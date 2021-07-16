import { Request } from 'express';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User } from '@v1/entities';

class InvalidateSessionService {
	constructor(private usersRepository: IUsersRepository) {}

	async invalidate(id: string) {
		try {
			const userInfo = await this.usersRepository.findById(id);

			if (userInfo == null || userInfo.ip == null || userInfo.token_version == null) {
				throw new Error('Could not find user with token id.');
			}

			await this.usersRepository.update({
				id,
				created_at: userInfo.created_at,
				name: userInfo.name,
				email: userInfo.email,
				password: userInfo.password,
				token_version: userInfo.token_version + 1,
				ip: userInfo.ip,
			});
		} catch (error) {
			if (error.message == 'FindUserById method failed.') {
				throw new Error('Could not find user with token id.');
			}

			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const usersRepository = new SqliteUsersRepository();
		const InvalidateSession = new InvalidateSessionService(usersRepository);

		await InvalidateSession.invalidate(request.params.id);

		return {
			status: 200,
			message: 'User session invalidated',
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
