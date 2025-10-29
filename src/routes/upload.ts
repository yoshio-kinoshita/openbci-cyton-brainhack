import { Router } from 'express';
import multer from 'multer';

import { parseOpenBciCsv } from '@services/openbciCsvParser';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

export const uploadRouter = Router();

uploadRouter.post('/csv', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSVファイルがアップロードされていません。' });
    }

    const result = parseOpenBciCsv(req.file.buffer.toString('utf8'));
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});
