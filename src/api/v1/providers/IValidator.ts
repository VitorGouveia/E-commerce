export interface IValidator {
	execute: (email: string) => boolean;
}
