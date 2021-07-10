type ApiResponse = {
	status: number;
	body: {
		message: string;
	};
};

describe('IP ban', () => {
	it('should be IP banned in user routes', async () => {
		/**
		 * Need to find a way to change supertest request IP so I can see if API really blocks it
		 * 1. change whats written inside ips.json with node.js so the ip is blocked temporarily
		 */
	});
});
