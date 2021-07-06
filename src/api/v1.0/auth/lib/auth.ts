import { User } from '@v1/entities/User';

import { createToken } from './token';

export const auth = {
	create({ id, token_version }: User, expiresIn: string) {
		const user = { id, token_version };

		const access_token = createToken(user, expiresIn);

		return access_token;
	},
};
