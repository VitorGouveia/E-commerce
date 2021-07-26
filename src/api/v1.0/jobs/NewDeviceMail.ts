import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const NewDeviceMail: Job<DataType> = {
	key: 'NewDeviceMail',
	options: {
		priority: 2,
		attempts: 5,
	},
	handle: async ({ data }) => {
		const { user } = data;
		const { name, email, ip } = user!;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},
			subject: `You logged in from a different IP!.`,
			body: `<p>${name} is this your ip: ${ip}</p>`,
		});
	},
};
