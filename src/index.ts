import 'reflect-metadata';

import { createApp } from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';

const app = createApp();

const start = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    app.listen(env.port, () => {
      // Keep log concise for startup confirmation.
      console.log(`API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

if (env.nodeEnv !== 'test') {
  void start();
}

export { app, start };
