import axios from 'axios';

import { getMlServiceUrl } from '../config/ml';

const client = axios.create({
  baseURL: getMlServiceUrl(),
  timeout: 5000,
});

export const classifyDocument = async (content: string, language = 'en') => {
  const response = await client.post('/classify', { content, language });
  return response.data as { category: string; confidence: number };
};

export const predictShipmentRisk = async (payload: {
  product: string;
  origin: string;
  destination: string;
  status: string;
}) => {
  const response = await client.post('/predict-risk', payload);
  return response.data as { riskScore: number; explanation?: string };
};


