const getEnvVar = (key: string) => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return typeof value === 'string' ? value : undefined;
};

export const getApiBaseUrl = () => getEnvVar('VITE_API_URL') ?? 'http://localhost:4000/api';
export const getMapboxToken = () => getEnvVar('VITE_MAPBOX_TOKEN') ?? '';
export const getMlServiceUrl = () => getEnvVar('VITE_ML_SERVICE_URL') ?? 'http://localhost:8000';

