import { Request } from 'express';
import { verify } from 'jsonwebtoken';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User, randomNumber } from '@v1/entities';
import auth from '@v1/auth';
import Queue from '@v1/config/queue';

class ActivateUserService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(authHeader: string | undefined, ip: string) {
		try {
			const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
			if (!authHeader) throw new Error('Token not found.');

			const token = authHeader && authHeader.split(' ')[1];
			if (!token) throw new Error('Your token must include Bearer');

			const { name, email, password, isHash }: any = verify(token, access_token_secret);

			const userAlreadyExists = await this.usersRepository.findByEmail(email);

			if (userAlreadyExists.length) throw new Error('User already exists.');

			ip = ip.slice(7);
			let user = new User({
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

			if (!!isHash) {
				user.password = password;
			}

			// store user
			await this.usersRepository.save(user);

			// create jwt
			const { id, token_version } = user;
			if (token_version == undefined) throw new Error('a');
			const access_token = auth.access_token({ id, token_version }, '24h');

			const data = { user };
			Queue.add('ActivationMail', data);

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
	const UsersRepository = new SqliteUsersRepository();

	const ActivateUser = new ActivateUserService(UsersRepository);

	const { user, access_token } = await ActivateUser.execute(
		request.headers['authorization'],
		request.ip
	);

	return {
		status: 201,
		user,
		access_token,
		message: 'User created with success!',
	};
};
