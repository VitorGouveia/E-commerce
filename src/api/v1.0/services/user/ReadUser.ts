import { Request } from 'express';
import { ParsedQs } from 'qs';

import { IUsersRepository } from '@v1/repositories';
import { SqliteUsersRepository } from '@v1/repositories/implementations';

import { User } from '@v1/entities';

type readUserResponse = {
	users: User[];
};

class ReadUserService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(id: string, { query }: Request<ParsedQs>) {
		try {
			// listing options
			let page: number = Number(query.page);
			let quantity: number = Number(query.quantity);

			let sort: any = String(query.sort);
			let property: any = String(query.property);

			// if id is supplied search user with that id
			if (id != undefined) {
				const users = await this.usersRepository.findById(id);

				return {
					users,
				};
			}

			// if no page and no quantity are supplied, list all users
			if (!page && !quantity) {
				const users = await this.usersRepository.findAll(property, sort);

				return {
					users,
				};
			}

			// if only page and quantity are supplied, sort users with pagination
			if (page != undefined && sort != undefined) {
				const users = await this.usersRepository.findAllPagination(page, quantity, property, sort);

				return {
					users,
				};
			}
		} catch (error) {
			return error;
		}
	}
}

export default async (request: Request) => {
	// create sqlite repository
	const UsersRepository = new SqliteUsersRepository();

	// create read user service
	const ReadUser = new ReadUserService(UsersRepository);

	// execute user service
	const { users }: readUserResponse = await ReadUser.execute(request.params.id, request);

	// respond with user information
	return {
		status: 202,
		users,
		message: 'Listed users with success!',
	};
};
