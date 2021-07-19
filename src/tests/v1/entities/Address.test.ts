import { Address } from '@v1/entities';

describe('Address entity', () => {
	it('should create an address entity', () => {
		const addressDTO: Address = {
			user_id: '00000000-0000-0000-0000-000000000000',
			postal_code: '00000-000',
			city: 'test city',
			state: 'TS',
			street: 'test street',
			number: 0,
		};

		const address = new Address(addressDTO);

		expect(address).toBeTruthy();

		expect(address.user_id).toBe(addressDTO.user_id);
		expect(address.postal_code).toBe(addressDTO.postal_code);
		expect(address.city).toBe(addressDTO.city);
		expect(address.state).toBe(addressDTO.state);
		expect(address.street).toBe(addressDTO.street);
		expect(address.number).toBe(addressDTO.number);
	});
});
