import auth from '@v1/auth';
import { sign, verify } from 'jsonwebtoken';

export const tokenTest = () => {
	it('should create an access_token', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

		const tokenInfo = {
			id: '1',
			token_version: 0,
		};

		const jwt_access_token = sign(tokenInfo, access_token_secret);
		const access_token = auth.access_token(tokenInfo, '24h');

		const payload = verify(access_token, access_token_secret);
		const jwt_payload = verify(jwt_access_token, access_token_secret);

		expect(access_token.length).toBeGreaterThan(1);

		expect(payload['id']).toBe(jwt_payload['id']);
		expect(payload['token_version']).toBe(jwt_payload['token_version']);
	});

	it('should create an refresh_token', async () => {
		const refresh_token_secret = String(process.env.JWT_REFRESH_TOKEN);

		const tokenInfo = {
			id: '1',
			token_version: 0,
		};

		const jwt_refresh_token = sign(tokenInfo, refresh_token_secret);
		const refresh_token = auth.refresh_token(tokenInfo, '7d');

		const payload = verify(refresh_token, refresh_token_secret);
		const jwt_payload = verify(jwt_refresh_token, refresh_token_secret);

		expect(refresh_token.length).toBeGreaterThan(1);

		expect(payload['id']).toBe(jwt_payload['id']);
		expect(payload['token_version']).toBe(jwt_payload['token_version']);
	});

	it('should fail to find token', async () => {
		try {
			const token = auth.verify(undefined, 'access');
		} catch (error) {
			expect(error.message).toBe('Token not supplied to auth lib.');
		}
	});

	it('should fail to verify bearer token', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);
		const tokenInfo = {
			id: '1',
			token_version: 0,
		};

		const access_token = sign(tokenInfo, access_token_secret);

		try {
			const token = auth.verify(access_token, 'access');
		} catch (error) {
			expect(error.message).toBe('Your token must include Bearer.');
		}
	});

	it('should verify token with success!', async () => {
		const access_token_secret = String(process.env.JWT_ACCESS_TOKEN);

		const tokenInfo = {
			id: '1',
			token_version: 0,
		};

		var test_token = auth.access_token(tokenInfo, '24h');

		const jwt_payload = verify(test_token, access_token_secret);

		test_token = `Bearer ${test_token}`;
		const test_payload = auth.verify(test_token, 'access');

		expect(jwt_payload['id']).toBe(test_payload['id']);
		expect(jwt_payload['token_version']).toBe(test_payload['token_version']);
	});
};
