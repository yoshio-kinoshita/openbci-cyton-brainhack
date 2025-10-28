import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { BrainwaveSession } from '@entities/BrainwaveSession';
import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  synchronize: false,
  logging: env.nodeEnv === 'development',
  entities: [BrainwaveSession],
  migrations: [],
  subscribers: [],
});
