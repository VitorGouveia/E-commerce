import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, JobsData } from './index';
export const ActivationMail: Job<JobsData> = {
	key: 'ActivationMail',
	options: {
		delay: 0,
		priority: 1,
		attempts: 3,
	},
	async handle({ data }) {
		const { user } = data;
		const { name, email } = user!;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},
			subject: `Welcome to NeoExpensive ${name}`,
			body: `<h1>Hi there ${name}, welcome!</h1>`,
		});
	},
};
