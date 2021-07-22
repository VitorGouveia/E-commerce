import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User } from '@v1/entities';

type LoginRequestType = {
	email: string;
	password: string;
};

class CreateDashSessionService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(loginRequest: LoginRequestType, authHeader: string | undefined) {
		try {
			const dash_access_token = String(process.env.DASH_ACCESS_TOKEN);
			const dash_refresh_token = String(process.env.DASH_REFRESH_TOKEN);

			const token = authHeader?.split(' ')[1];
			if (authHeader == undefined) throw new Error('No token was found');
			if (token == undefined)
				throw new Error(`
        Your token must include Bearer:\n
          example: 'Bearer <your_token>'
      `);

			const payload = verify(token, dash_access_token);
			const jwt_user = {
				id: payload['id'],
				token_version: payload['token_version'],
			};

			const refresh_token = sign(
				jwt_user,
				dash_refresh_token,
				{ expiresIn: '168h' } // 7 days
			);

			return {
				jwt_login: true,
				refresh_token,
			};
		} catch (error) {
			const { email, password } = loginRequest;

			const user = await this.usersRepository.findByEmail(email);

			if (user.length == 0) throw new Error('Wrong e-mail!');

			const comparePassword = await compare(password, user[0].password);

			if (comparePassword != true) throw new Error('Wrong password!');

			const dash_refresh_token = String(process.env.DASH_REFRESH_TOKEN);

			const [{ id, name }] = user;
			const jwt_user = {
				id,
				name,
				email: user[0].email,
			};

			const refresh_token = sign(jwt_user, dash_refresh_token, {
				expiresIn: '168h',
			});

			return {
				social_login: true,
				refresh_token,
			};
		}
	}
}

export default async (request: Request) => {
	const UsersRepository = new SqliteUsersRepository();
	const CreateDashSession = new CreateDashSessionService(UsersRepository);

	const { refresh_token, jwt_login, social_login } = await CreateDashSession.execute(
		request.body,
		request.headers['authorization']
	);

	return {
		jwt_login,
		social_login,
		status: 200,
		refresh_token,
	};
};
