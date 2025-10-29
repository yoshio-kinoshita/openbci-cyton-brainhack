import { Router } from 'express';

import { analysisRouter } from './analysis';
import { healthRouter } from './health';
import { uploadRouter } from './upload';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/analysis', analysisRouter);
apiRouter.use('/upload', uploadRouter);
