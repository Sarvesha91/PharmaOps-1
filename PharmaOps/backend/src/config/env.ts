import dotenv from 'dotenv';

dotenv.config();

export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
};

export const isProduction = () => getEnv('NODE_ENV', 'development') === 'production';

