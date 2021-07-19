import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import validator from 'validator';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User } from '@v1/entities';
import Queue from '@v1/config/queue';

// create user service is responsible for authentication and some rules
class CreateUserService {
	constructor(private usersRepository: IUsersRepository) {}

	async create({ name, email, password }: User) {
		try {
			const access_token = String(process.env.JWT_ACCESS_TOKEN);

			const isEmail = validator.isEmail(email);
			if (!isEmail) throw new Error('Invalid e-mail.');

			// searches users with that e-mail
			const [userAlreadyExists] = await this.usersRepository.findByEmail(email);

			// if user with same email exists
			if (userAlreadyExists) throw new Error('User already exists.');

			const token = sign(
				{
					name,
					email,
					password,
				},
				access_token,
				{ expiresIn: '15m' }
			);

			const user = { name, email };
			const data = { user, token };
			await Queue.add('RegistrationMail', data);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

// just return everything from create user service
export default async (request: Request) => {
	try {
		const UsersRepository = new SqliteUsersRepository();
		const CreateUser = new CreateUserService(UsersRepository);

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
