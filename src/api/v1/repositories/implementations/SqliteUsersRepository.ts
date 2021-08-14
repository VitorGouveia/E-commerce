import { IUsersRepository } from '@v1/repositories';
import { User } from '@v1/entities';

import { User as UserType } from '@prisma/client';
import { prisma } from '@src/prisma';

import validator from 'validator';

export class SqliteUsersRepository implements IUsersRepository {
	async findAll(property?: string, sort?: 'asc' | 'desc' | string): Promise<UserType[]> {
		const users = await prisma.user.findMany();

		if (property != undefined && sort != 'undefined') {
			const users = await prisma.user.findMany({
				orderBy: [
					{
						[property]: sort,
					},
				],
			});

			return users;
		}

		return users;
	}

	async findById(id: string): Promise<UserType> {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},

			include: {
				address: {
					select: {
						id: true,
						postal_code: true,
						city: true,
						state: true,
						street: true,
						number: true,
					},
				},

				cart: {
					select: {
						id: true,
						item: true,
					},
				},

				payment: {
					select: {
						id: true,
						method: true,
						card_brand: true,
						card_code: true,
						card_month: true,
						card_number: true,
						card_year: true,
					},
				},
			},
		});

		if (user == null) throw new Error('FindUserById method failed.');

		return user;
	}

	async findByEmail(email: string): Promise<UserType> {
		const isEmail = validator.isEmail(email);

		if (!isEmail) {
			throw new Error('Invalid email.');
		}

		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		return user!;
	}

	async findUserhash(name: string, userhash: string): Promise<UserType[]> {
		const user = await prisma.user.findMany({
			where: {
				name,
				userhash,
			},
		});

		return user;
	}

	async findUsername(
		username: string | undefined,
		userhash: string | undefined
	): Promise<UserType[]> {
		const user = await prisma.user.findMany({
			where: {
				username,
				userhash,
			},
		});

		return user;
	}

	async usernameLogin(username: string | undefined, password: string): Promise<UserType[]> {
		const user = await prisma.user.findMany({
			where: {
				username,
				password,
			},
		});

		return user;
	}

	async findAllPagination(
		page: number,
		quantity: number,
		property?: string,
		sort?: string
	): Promise<UserType[] | {}> {
		const users = await prisma.user.findMany({
			take: quantity,
			skip: quantity * page,
			select: {
				id: true,
				created_at: true,
				name: true,
				lastname: true,
				username: true,
				userhash: true,
				cpf: true,
				email: true,
			},
		});

		if (property != undefined && sort != 'undefined') {
			const users = await prisma.user.findMany({
				take: quantity,
				skip: quantity * page,
				orderBy: {
					[property]: sort,
				},
			});

			return users;
		}

		return users;
	}

	async update({ id, created_at, ...props }: User): Promise<void> {
		await prisma.user.update({
			where: {
				id,
			},

			data: {
				...props,
			},
		});
	}

	async save(user: User): Promise<void> {
		const {
			id,
			created_at,
			admin,
			ip,
			name,
			email,
			password,
			cpf,
			lastname,
			username,
			userhash,
			ban,
			reason_for_ban,
			shadow_ban,
			token_version,
			confirmed,
		} = user;

		await prisma.user.create({
			data: {
				id,
				created_at,
				admin,
				ban,
				shadow_ban,
				reason_for_ban,
				ip,
				name,
				email,
				password,
				cpf,
				lastname,
				username,
				userhash,
				token_version,
				confirmed,
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.address.deleteMany({
			where: {
				user_id: id,
			},
		});

		await prisma.user.delete({
			where: {
				id,
			},
		});
	}
}
