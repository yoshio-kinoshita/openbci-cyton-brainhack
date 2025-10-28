import { Router } from 'express';

import { analysisRouter } from './analysis';
import { healthRouter } from './health';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/analysis', analysisRouter);
