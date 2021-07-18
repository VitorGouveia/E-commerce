import Queue from 'bull';
import redisConfig from '@v1/config/redis';

import * as jobs from '@v1/jobs';

const queues = Object.values(jobs).map(job => ({
	bull: new Queue(job.key, redisConfig.url),
	name: job.key,
	handle: job.handle,
	options: job.options,
}));

export default {
	queues,
	add(name: string, data: any, options?: any) {
		const queue = this.queues.find(queue => queue.name === name);

		if (!queue) throw new Error('Could not find this queue.');

		return queue.bull.add(data, options || queue.options);
	},
	process() {
		return this.queues.forEach(queue => {
			queue.bull.process(queue.handle);

			queue.bull.on('failed', job => {
				new Queue(job.name, redisConfig.url);
			});

			queue.bull.on('completed', job => {
				console.log(`${job.id} job completed`);
			});
		});
	},
};
