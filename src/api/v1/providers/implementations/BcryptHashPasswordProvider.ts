import { IHashPassword } from '../';

import { hash, compare } from 'bcrypt';

export class BcryptHashPasswordProvider implements IHashPassword {
	async hash(password: string, salt?: number): Promise<string> {
		if (!salt) {
			salt = 10;
		}

		const hashedPassword = await hash(password, salt);

		return hashedPassword;
	}

	async compare(password: string, hashPassword: string): Promise<boolean> {
		const comparePassword = await compare(password, hashPassword);

		return comparePassword;
	}
}
