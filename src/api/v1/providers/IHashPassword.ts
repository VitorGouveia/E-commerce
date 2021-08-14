export interface IHashPassword {
	execute: (password: string, salt?: number) => Promise<string>;
}
