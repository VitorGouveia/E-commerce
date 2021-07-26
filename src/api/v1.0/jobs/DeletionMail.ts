import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const DeletionMail: Job<DataType> = {
	key: 'DeletionMail',
	options: {
		attempts: 1,
	},
	handle: async ({ data }) => {
		const { user } = data;
		const { name, email } = user!;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},

			subject: `Goodbye from NeoExpensive ${name}!`,
			body: `We're so sad to see you go ${name}...`,
		});
	},
};
