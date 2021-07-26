import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const ForgotPasswordMail: Job<DataType> = {
	key: 'ForgotPasswordMail',
	options: {
		attempts: 5,
	},
	handle: async ({ data }) => {
		const { user, token } = data;
		const { name, email } = user!;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},
			subject: 'Forgot password.',
			body: `<p>You forgot your password? No trouble, use this token:\n ${token}</p>`,
		});
	},
};
