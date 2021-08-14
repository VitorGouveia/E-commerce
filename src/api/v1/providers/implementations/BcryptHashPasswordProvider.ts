import { IHashPassword } from '../';

import { hash } from 'bcrypt';

export class BcryptHashPasswordProvider implements IHashPassword {
	async execute(password: string, salt?: number): Promise<string> {
		if (!salt) {
			salt = 10;
		}

		const hashedPassword = await hash(password, salt);

		return hashedPassword;
	}
}
