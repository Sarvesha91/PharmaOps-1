import type { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ message: err.message || 'Internal server error' });
};

