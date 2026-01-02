import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import { getEnv } from './config/env';
import { getSwaggerDocument } from './config/swagger';
import { connectRedis } from './cache/redisClient';
import { AppDataSource } from './data/dataSource';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { workflowEngine } from './workflows/workflowEngine';

export const createApp = async () => {
  const nodeEnv = getEnv('NODE_ENV', 'development');
  const isTest = nodeEnv === 'test';

  if (!isTest && !AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  if (!isTest) {
    await connectRedis().catch(() => undefined);
    workflowEngine.start();
  }

  const app = express();
  app.use(
    cors({
      origin: getEnv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:5174').split(','),
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(express.json({ limit: '10mb' }));
  app.use(requestLogger);

  const swaggerDocument = getSwaggerDocument();
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => res.json({ message: 'PharmaOps API is running', docs: '/api/docs', health: '/api/health' }));

  app.use('/api', routes);

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
  });

  app.use(errorHandler);

  return app;
};
