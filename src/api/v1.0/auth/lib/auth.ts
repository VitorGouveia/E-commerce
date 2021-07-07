import { User } from '@v1/entities/User';

import { createToken } from './token';

export const auth = {
	create({ id, token_version }: User, expiresIn: string) {
		if (token_version == null) {
			throw new Error('Token version is null, not your fault.');
		}

		const access_token = createToken({ id, token_version }, expiresIn);

		return access_token;
	},
};
