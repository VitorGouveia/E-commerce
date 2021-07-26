import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, JobsData } from './index';
export const RegistrationMail: Job<JobsData> = {
	key: 'RegistrationMail',
	options: {
		delay: 0,
		priority: 1,
		attempts: 3,
	},
	async handle({ data }) {
		const { user, token } = data;
		const { name, email } = user!;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},
			subject: 'Verification e-mail.',
			body: `<p>Your verification token is ${token}</p>`,
		});
	},
};
