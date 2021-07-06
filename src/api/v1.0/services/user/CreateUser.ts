import { Request } from 'express';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User, randomNumber } from '@v1/entities';

import auth from '@v1/auth';

type createUserResponse = {
	userHashAlreadyExists: User[];
	userAlreadyExists: User;
	access_token: string;
	user: User;
};

// create user service is responsible for authentication and some rules
class CreateUserService {
	constructor(private usersRepository: IUsersRepository) {}

	async create({ name, email, password }: User, { ip }: Request) {
		try {
			// searches users with that e-mail
			const userAlreadyExists = await this.usersRepository.findByEmail(email);

			// if user with same email exists
			if (userAlreadyExists.length) throw new Error('User already exists.');

			ip = ip.slice(7);
			// creates user
			const user = new User({
				name,
				email,
				password,
				ip,
				shadow_ban: false,
				ban: false,
				reason_for_ban: '',
				token_version: 0,
			});

			// searches for duplicate user hash
			const userHashAlreadyExists = await this.usersRepository.findUserhash(
				user.name,
				user.userhash
			);
			// stores user in the database
			await this.usersRepository.save(user);

			// creates JWT access token
			const access_token = auth.create(user, '24h');

			return {
				userHashAlreadyExists,
				access_token,
				user,
			};
		} catch (error) {
			throw new Error(error.message);
			return error;
		}
	}
}

// just return everything from create user service
export default async (request: Request) => {
	try {
		const UsersRepository = new SqliteUsersRepository();
		const CreateUser = new CreateUserService(UsersRepository);

		const { userHashAlreadyExists, access_token, user }: createUserResponse =
			await CreateUser.create(request.body, request);

		// if user with name and hash already exist generate another hash
		if (userHashAlreadyExists.length) user.userhash = randomNumber(4);

		// respond with user information
		return {
			status: 201,
			access_token,
			user,
			message: 'User created with success!',
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
