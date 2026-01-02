import path from 'node:path';
import YAML from 'yamljs';

const swaggerPath = path.resolve(__dirname, '../../swagger.yaml');

export const getSwaggerDocument = () => YAML.load(swaggerPath);

