import { genSaltSync, hashSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';

export function randomNumber(length: number, chars?: string) {
	var chars: string | undefined = '0123456789';

	const number = [...Array(length)]
		.map(i => chars[Math.floor(Math.random() * chars.length)])
		.join('');

	return number;
}

interface optionalProps {
	id?: string;
	created_at?: number;
	admin?: {
		username: string | any;
		userhash: number | any;
	};
}

export class User {
	public readonly id: string;
	public readonly created_at: number;
	public readonly admin?: boolean;
	public ip: string;
	public shadow_ban?: boolean;
	public ban?: boolean;
	public reason_for_ban?: string;
	public token_version?: number;
	public failed_attemps?: number;
	public confirmed?: boolean | null;

	public name: string;
	public lastname?: string | undefined;
	public username?: string | any;
	public userhash?: number | any;
	public cpf?: string;
	public email: string;
	public password: string;

	constructor(
		props: Omit<User, 'id' | 'created_at'>,
		{ id, created_at, admin }: optionalProps = {}
	) {
		// if no id was supplied, generate uuid
		if (!id) this.id = uuid();

		if (id) this.id = id;

		if (created_at) this.created_at = created_at;

		// if no date was supplied, generate new ISO date
		if (!created_at) this.created_at = Date.now();

		if (!admin) this.admin = false;

		// create user object
		Object.assign(this, props);
		this.failed_attemps = 0;
		this.token_version = 0;

		if (admin) {
			this.admin = true;
			this.username = admin.username;
			this.userhash = admin.userhash;
		} else {
			// generate user hash
			if (!props.username) this.username = `${this.name}`;
			if (!props.userhash) this.userhash = randomNumber(4);
		}

		// encrypt password and ip
		const salt = genSaltSync(10);
		this.ip = hashSync(this.ip, 4);
		this.password = hashSync(this.password, salt);
	}
}
