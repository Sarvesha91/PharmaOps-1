import { DataSourceOptions } from 'typeorm';

import { getEnv } from './env';

export const getDatabaseConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: getEnv('POSTGRES_HOST', 'localhost'),
  port: Number(getEnv('POSTGRES_PORT', '5432')),
  username: getEnv('POSTGRES_USER', 'pharmaops'),
  password: getEnv('POSTGRES_PASSWORD', 'pharmaops'),
  database: getEnv('POSTGRES_DB', 'pharmaops'),
  logging: getEnv('TYPEORM_LOGGING', 'false') === 'true',
  ssl: getEnv('POSTGRES_USE_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : undefined,
});

