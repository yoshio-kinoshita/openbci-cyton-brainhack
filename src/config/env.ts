import { config } from 'dotenv';

config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number value provided: ${value}`);
  }
  return parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseNumber(process.env.PORT, 3000),
  dbHost: process.env.POSTGRES_HOST ?? 'localhost',
  dbPort: parseNumber(process.env.POSTGRES_PORT, 5433),
  dbUser: process.env.POSTGRES_USER ?? 'openbci',
  dbPassword: process.env.POSTGRES_PASSWORD ?? 'openbci',
  dbName: process.env.POSTGRES_DB ?? 'openbci',
};
