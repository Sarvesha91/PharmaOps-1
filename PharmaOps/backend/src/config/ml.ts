import { getEnv } from './env';

export const getMlServiceUrl = () => getEnv('ML_SERVICE_URL', 'http://localhost:8000');


