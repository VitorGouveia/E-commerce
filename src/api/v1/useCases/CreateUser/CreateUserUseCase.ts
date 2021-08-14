import { IUsersRepository } from '@v1/repositories';
import { IHashPassword, IToken, IValidator } from '@v1/providers';
import { ICreateUserRequestDTO, ICreateUserResponseDTO } from './CreateUserDTO';

export class CreateUserUseCase {
	constructor(
		private usersRepository: IUsersRepository,
		private emailValidator: IValidator,
		private hashPassword: IHashPassword,
		private tokenProvider: IToken
	) {}

	async execute(props: ICreateUserRequestDTO): Promise<ICreateUserResponseDTO> {
		let { name, email, password, isHash } = props;

		const access_token_secret = process.env.JWT_ACCESS_TOKEN!;

		/* Checks whether or not the email is valid */
		const isEmail = this.emailValidator.execute(email);
		if (!isEmail) {
			throw new Error('Invalid e-mail.');
		}

		/* Checks whether the user already exists */
		const userAlreadyExists = await this.usersRepository.findByEmail(email);
		if (userAlreadyExists) {
			throw new Error('User already exists.');
		}

		/* creates the token to activate user account later */
		let token = '';
		password = await this.hashPassword.hash(password, 10);
		const tokenProps = { name, email, password, isHash };

		token = this.tokenProvider.create(tokenProps, access_token_secret, '15m');

		/* if the password is already hashed */
		if (isHash) {
			token = this.tokenProvider.create(tokenProps, access_token_secret, '15m');
		}

		return {
			token,
			user: {
				name,
				email,
				password,
				isHash,
			},
		};
	}
}
