import { IUsersRepository } from '@v1/repositories';

import { User as UserType } from '@prisma/client';
import { isBanned } from '@v1/utils/IsBanned';
import { compare } from 'bcrypt';

const check_failed_attemps = (user: UserType) => {
	if (user.failed_attemps && user.failed_attemps >= 5) {
		return true;
	}
};

export class emailLogin {
	constructor(private usersRepository: IUsersRepository) {}

	async handle(email: string, password: string) {
		try {
			const [user] = await this.usersRepository.findByEmail(email);
			if (!user) throw new Error('Wrong e-mail!');

			const failed_too_many = check_failed_attemps(user);

			if (failed_too_many) {
				const { id, created_at, name, email, password, token_version } = user;

				if (token_version == null) {
					return {};
				}

				return {
					failed_too_many: {
						id,
						created_at,
						name,
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
			if (token_version == null) return {};
			if (matchPassword == false) {
				if (failed_attemps == null) return {};

				return {
					matchPassword: {
						id,
						created_at,
						name,
						email: user.email,
						password: user.password,
						failed_attemps: failed_attemps + 1,
					},
				};
			}

			return {
				user: {
					id,
					created_at,
					name,
					email,
					password: user.password,
					token_version,
					failed_attemps: 0,
				},
			};
		} catch (error) {
			throw new Error(error);
		}
	}
}
