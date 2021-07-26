import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const FailedLoginMail: Job<DataType> = {
	key: 'FailedLoginMail',
	options: {
		priority: 5,
		attempts: 5,
	},
	handle: async ({ data }) => {
		const { user } = data;
		const { name, email, failed_attemps } = user!;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},
			subject: `${failed_attemps} Failed login attemps were made to your account ${name}.`,
			body: `<p>${name} contact us if it wasn't trying to login.</p>`,
		});
	},
};
