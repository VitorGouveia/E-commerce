import { IMessage, IMailProvider } from '../IMailProvider';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class MailTrapMailProvider implements IMailProvider {
	private transporter: Mail;

	constructor() {
		const host = process.env.MAIL_HOST;
		const port = process.env.MAIL_PORT;
		const user = process.env.MAIL_USER;
		const pass = process.env.MAIL_PASS;

		const auth = {
			user,
			pass,
		};

		const config = {
			host,
			port,
			auth,
		};

		this.transporter = nodemailer.createTransport(config as SMTPTransport.Options);
	}

	async sendMail(message: IMessage): Promise<void> {
		await this.transporter.sendMail({
			to: {
				name: message.to.name,
				address: message.to.email,
			},
			from: {
				name: message.from.name,
				address: message.from.email,
			},
			subject: message.subject,
			html: message.body,
		});
	}
}
