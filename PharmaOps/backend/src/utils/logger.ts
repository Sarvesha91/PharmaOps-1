/* eslint-disable no-console */
const logger = {
  info: (message: string | Record<string, unknown>, context?: unknown) => console.log(message, context ?? ''),
  error: (message: unknown, context?: unknown) => console.error(message, context ?? ''),
};

export default logger;

