import { User } from '@v1/entities/User';
import { User as UserType } from '@prisma/client';
export interface IUsersRepository {
	findAll(property?: string, sort?: 'asc' | 'desc' | string): Promise<UserType[]>;
	findById(id: string, select?: string): Promise<UserType>;
	findByEmail(email: string): Promise<UserType>;
	findUserhash(name: string, userhash: string): Promise<UserType[]>;
	findUsername(username: string | undefined, userhash: string | undefined): Promise<UserType[]>;
	usernameLogin(username: string | undefined, password: string): Promise<UserType[]>;
	findAllPagination(page: number, quantity: number, property?: string, sort?: string): Promise<{}>;
	update({ id, created_at, ...props }: User): Promise<void>;
	save(user: User): Promise<void>;
	delete(id: string): Promise<void>;
}
