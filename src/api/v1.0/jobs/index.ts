import Queue from 'bull';

export { RegistrationMail } from './RegistrationMail';
export { ActivationMail } from './ActivationMail';

export type DataType = {
	user: {
		name: string;
		email: string;
	};
	token?: string;
};

export type JobsTypes = 'RegistrationMail' | 'ActivationMail';
export type JobsData = DataType;
export type JobsOptions = Queue.JobOptions;

export type Job<T> = {
	key: 'RegistrationMail' | 'ActivationMail';
	options: JobsOptions;
	handle: Queue.ProcessCallbackFunction<T>;
};
