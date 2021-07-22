import { Request } from 'express';
import { verify } from 'jsonwebtoken';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { IMailProvider } from '@v1/providers';
import { MailTrapMailProvider } from '@v1/providers/implementations';

import { ParsedQs } from 'qs';
import Queue from '@v1/config/queue';

class BanUserService {
	constructor(private usersRepository: IUsersRepository, private mailProvider: IMailProvider) {}

	async execute(id: string, { query, headers }: Request<ParsedQs>) {
		try {
			const isShadowBan = String(query.shadow);
			const reason_for_ban = String(query.reason);

			if (isShadowBan != 'undefined') {
				const user = await this.usersRepository.findById(id);

				if (user == null || user.token_version == null || user.ip == null) {
					throw new Error('Did not find user with that id.');
				}

				await this.usersRepository.update({
					id: user.id,
					created_at: user.created_at,
					name: user.name,
					email: user.email,
					password: user.password,
					shadow_ban: true,
					ban: true,
					reason_for_ban,
					ip: user.ip,
					token_version: user.token_version + 1,
				});

				return;
			}

			const user = await this.usersRepository.findById(id);

			if (user == null || user.token_version == null || user.ip == null) {
				throw new Error('Did not find user with that id.');
			}

			await this.usersRepository.update({
				id: user.id,
				created_at: user.created_at,
				name: user.name,
				email: user.email,
				password: user.password,
				shadow_ban: false,
				ban: true,
				reason_for_ban,
				ip: user.ip,
				token_version: user.token_version + 1,
			});

			const DASH_REFRESH_TOKEN = String(process.env.DASH_REFRESH_TOKEN);
			const authHeader = headers['authorization'];
			const token = String(authHeader && authHeader.split(' ')[1]);

			const payload = verify(token, DASH_REFRESH_TOKEN);

			const admin_user = await this.usersRepository.findById(payload['id']);

			if (!admin_user) {
				throw new Error('No admin user was found with that JWT.');
			}

			await Queue.add('BanMail', {
				user: {
					name: user.name,
					email: user.name,
					reason_for_ban: user.name,
				},
				admin_user,
			});
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const UsersRepository = new SqliteUsersRepository();
	const MailProvider = new MailTrapMailProvider();
	const BanUser = new BanUserService(UsersRepository, MailProvider);

	await BanUser.execute(request.params.id, request);

	return {
		status: 202,
		message: 'Banned user with success!',
	};
};
