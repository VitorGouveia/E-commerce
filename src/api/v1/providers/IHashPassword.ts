export interface IHashPassword {
	hash: (password: string, salt?: number) => Promise<string>;
	compare: (password: string, hashPassword: string) => Promise<boolean>;
}
