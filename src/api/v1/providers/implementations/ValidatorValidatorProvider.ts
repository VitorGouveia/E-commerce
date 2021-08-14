import { IValidator } from '../';

import validator from 'validator';

export class ValidatorValidatorProvider implements IValidator {
	execute(email: string): boolean {
		const isEmail = validator.isEmail(email);

		return isEmail;
	}
}
