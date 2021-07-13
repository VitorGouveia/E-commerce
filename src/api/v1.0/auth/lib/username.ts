import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User as UserType } from '@prisma/client';
import { isBanned } from '@v1/utils/IsBanned';
import { compare } from 'bcrypt';

const check_failed_attemps = (user: UserType) => {
	if (user.failed_attemps && user.failed_attemps >= 5) {
		return true;
	}
};

export class usernameLogin {
	constructor(private usersRepository: IUsersRepository) {}

	async handle(username: string, userhash: string, password: string) {
		try {
			const [user] = await this.usersRepository.findUsername(username, userhash);

			if (!user) throw new Error('Wrong username!');

			const failed_too_many = check_failed_attemps(user);

			if (failed_too_many) {
				const { id, created_at, name, email, password, token_version } = user;

				return {
					failed_too_many: true,
					matchPassword: false,
					user: {
						id,
						created_at,
						name,
						username,
						userhash,
						email,
						password: user.password,
						failed_attemps: 0,
						token_version: token_version + 1,
					},
				};
			}

			isBanned(user.ban, user.shadow_ban);

			const { id, created_at, name, token_version, failed_attemps } = user;

			const matchPassword = await compare(password, user.password);
			if (matchPassword == false) {
				return {
					failed_too_many: false,
					matchPassword: true,
					user: {
						id,
						created_at,
						name,
						username,
						userhash,
						email: user.email,
						password: user.password,
						token_version,
						failed_attemps: failed_attemps + 1,
					},
				};
			}

			return {
				failed_too_many: false,
				matchPassword: false,
				user: {
					id,
					created_at,
					name,
					username,
					userhash,
					email: user.email,
					password: user.password,
					token_version,
					failed_attemps: 0,
				},
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
