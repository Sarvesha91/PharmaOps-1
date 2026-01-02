import type { Request, Response } from 'express';

import { AppDataSource } from '../data/dataSource';
import logger from '../utils/logger';

export const healthCheck = async (_req: Request, res: Response) => {
  const dbStatus = AppDataSource.isInitialized ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: dbStatus,
    },
  });
};

export const welcome = async (req: Request, res: Response) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  res.json({ message: 'Welcome to the PharmaOps Backend Service!' });
};

