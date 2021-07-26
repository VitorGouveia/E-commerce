import { MailTrapMailProvider } from '@v1/providers/implementations';
const mailProvider = new MailTrapMailProvider();

import { Job, DataType } from '@v1/jobs';
export const BanMail: Job<DataType> = {
	key: 'BanMail',
	options: {
		attempts: 3,
	},
	handle: async ({ data }) => {
		const { user, admin_user } = data;
		const { name, email } = user!;

		await mailProvider.sendMail({
			to: {
				name,
				email,
			},
			subject: `You're banned ${name}!`,
			body: `
					<p>
						${name} you were banned by admin <strong>${admin_user?.name}</strong>:<br>
						reason: ${user!.reason_for_ban}
					</p>
				`,
		});
	},
};
