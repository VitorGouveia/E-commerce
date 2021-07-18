import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import helmet from 'helmet';
import { config as dotenv } from 'dotenv';
import { router as v1 } from '@v1/routes';

import BullBoard from 'bull-board';
import Queue from '@v1/config/queue';

BullBoard.setQueues(Queue.queues.map(queue => queue.bull));
const app = express();

const router = express.Router();
router.use('/v1', v1);

dotenv({ path: '.env' });

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(router);
app.use(compression());
app.use('/admin', BullBoard.UI);

export { app };
