import { Router } from 'express';

export const analysisRouter = Router();

analysisRouter.post('/alpha', (_req, res) => {
  res.json({
    status: 'queued',
    message: 'アルファ波の解析ジョブを受け付けました。しばらくお待ちください。',
  });
});
