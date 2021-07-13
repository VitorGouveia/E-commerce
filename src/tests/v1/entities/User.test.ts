import { User, randomNumber } from '@v1/entities';
import bcrypt from 'bcrypt';

describe('User entity', () => {
	it('should create user entity', async () => {
		const userDTO = {
			name: 'test',
			lastname: 'jest',
			email: 'test@test.com',
			password: '123',
			cpf: '000.000.000-00',
			ip: '0.0.0.0',
			shadow_ban: false,
			ban: false,
			reason_for_ban: '',
			confirmed: false,
		};

		const user = new User(userDTO);

		expect(user).toBeTruthy();

		expect(user.id.length).toBe(36);
		expect(String(user.created_at).length).toBe(13);
		expect(user).toHaveProperty('token_version');
		expect(user.admin).toBe(false);
		expect(user.name).toBe(userDTO.name);
		expect(user.lastname).toBe(userDTO.lastname);
		expect(user.email).toBe(userDTO.email);
		expect(user.cpf).toBe(userDTO.cpf);

		const matchPassword = await bcrypt.compare(userDTO.password, user.password);
		const matchIP = await bcrypt.compare(userDTO.ip, user.ip);

		expect(user.password.length).toBeGreaterThan(10);
		expect(user.ip.length).toBeGreaterThan(10);

		expect(matchPassword).toBeTruthy();
		expect(matchIP).toBeTruthy();

		expect(user.shadow_ban).toBe(false);
		expect(user.ban).toBeFalsy();
		expect(user.ban).toBe(false);
		expect(user.reason_for_ban).toBe('');
		expect(user.confirmed).toBe(false);
		expect(user.token_version).toBe(0);
		expect(user.failed_attemps).toBe(0);
		expect(user.username).toBe(userDTO.name);
		expect(String(user.userhash).length).toBe(4);
	});

	it('should create an admin user', async () => {
		const userDTO = {
			name: 'test',
			lastname: 'jest',
			email: 'test@test.com',
			password: '123',
			cpf: '000.000.000-00',
			ip: '0.0.0.0',
			shadow_ban: false,
			ban: false,
			reason_for_ban: '',
			confirmed: false,
		};

		const user = new User(userDTO, {
			admin: {
				username: 'test',
				userhash: 1000,
			},
			id: '0',
			created_at: 0,
		});

		expect(user).toBeTruthy();

		expect(user.id.length).toBe(1);
		expect(user.id).toBe('0');

		expect(user.admin).toBe(true);
		expect(user.name).toBe(userDTO.name);
		expect(user.lastname).toBe(userDTO.lastname);
		expect(user.username).toBe(userDTO.name);
		expect(user.userhash).toBe(1000);
		expect(user.email).toBe(userDTO.email);
		expect(user.cpf).toBe(userDTO.cpf);

		const matchPassword = await bcrypt.compare(userDTO.password, user.password);
		const matchIP = await bcrypt.compare(userDTO.ip, user.ip);

		expect(user.password.length).toBeGreaterThan(10);
		expect(user.ip.length).toBeGreaterThan(10);

		expect(matchPassword).toBeTruthy();
		expect(matchIP).toBeTruthy();

		expect(user.shadow_ban).toBe(false);
		expect(user.ban).toBe(false);
		expect(user.reason_for_ban).toBe('');
		expect(user.confirmed).toBe(false);
		expect(user.token_version).toBe(0);
		expect(user.failed_attemps).toBe(0);
		expect(user.username).toBe(userDTO.name);
		expect(String(user.userhash).length).toBe(4);
	});

	it('should create a random 4 digit number', () => {
		const four_digit = randomNumber(4);
		const five_digit = randomNumber(5);

		expect(four_digit).toHaveLength(4);
		expect(five_digit).toHaveLength(5);
	});
});
