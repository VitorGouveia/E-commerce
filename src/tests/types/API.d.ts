export interface ApiResponse<T> {
	status: number;
	headers: {
		authorization: string;
	};
	body: {
		message: string;
		access_token: string;
		refresh_token: string;
		user: T;
		users: T;
		social_login: boolean;
		jwt_login: boolean;
	};
}
