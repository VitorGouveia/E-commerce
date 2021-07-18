import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

export default {
	key: 'RegistrationMail',
	options: {
		delay: 0,
		attemps: 3,
	},
	async handle({ data }): Promise<void> {
		const { user, token } = data;
		const { name, email } = user;

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
