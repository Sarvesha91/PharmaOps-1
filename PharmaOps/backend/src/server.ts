import { createServer } from 'node:http';

import { createApp } from './app';
import { getEnv } from './config/env';
import logger from './utils/logger';

const bootstrap = async () => {
  const app = await createApp();
  const port = Number(getEnv('PORT', '4000'));

  const server = createServer(app);
  server.listen(port, '0.0.0.0', () => {
    logger.info(`API listening on port ${port}`);
  });
};

bootstrap().catch((error) => {
  logger.error('Failed to boot server', error);
  process.exit(1);
});

