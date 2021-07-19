import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

export default {
	key: 'ActivationMail',
	options: {
		delay: 0,
		attemps: 3,
	},
	async handle({ data }): Promise<void> {
		const { user } = data;
		const { name, email } = user;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},
			subject: `Welcome to NeoExpensive ${user.name}`,
			body: `<h1>Hi there ${user.name}, welcome!</h1>`,
		});
	},
};
