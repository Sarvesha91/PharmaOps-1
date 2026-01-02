import axios from 'axios';

import { getApiBaseUrl } from '../config/env';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface structured errors for React Query
    return Promise.reject(
      error?.response?.data ?? {
        message: error.message ?? 'Unexpected error',
      },
    );
  },
);

