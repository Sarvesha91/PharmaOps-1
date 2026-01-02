import { DataSource } from 'typeorm';
import { getEnv } from '../config/env';

const isTest = getEnv('NODE_ENV', 'development') === 'test';

export const AppDataSource = new DataSource({
  type: isTest ? 'sqlite' : 'postgres',
  host: getEnv('POSTGRES_HOST', 'localhost'),
  port: Number(getEnv('POSTGRES_PORT', '5432')),
  username: getEnv('POSTGRES_USER', 'pharmaops'),
  password: getEnv('POSTGRES_PASSWORD', 'pharmaops'),
  database: isTest ? ':memory:' : getEnv('POSTGRES_DB', 'pharmaops'),

  synchronize: true, // Use sync for development
  logging: false, // Set to true for debugging SQL queries
  entities: ['src/entities/*.ts'], // Path to entities
  migrations: ['dist/migrations/*.js'], // Path to compiled migrations
  subscribers: [], // Optional: add subscribers here if needed
});
