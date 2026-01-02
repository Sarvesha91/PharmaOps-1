import { z } from 'zod';

import type { RegulatoryDocument } from '../types';
import { AppDataSource } from '../data/dataSource';
import { Document } from '../entities/Document';
import { redisClient } from '../cache/redisClient';
import { classifyDocument } from './mlClient';

const documentSchema = z.object({
  title: z.string(),
  region: z.string(),
  version: z.string(),
  status: z.enum(['draft', 'in_review', 'approved', 'retired']),
  owner: z.string(),
  effectiveDate: z.string(),
});

export const listDocuments = async (): Promise<RegulatoryDocument[]> => {
  const cacheKey = 'documents:list';
  if (redisClient.isOpen) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as RegulatoryDocument[];
    }
  }

  const repo = AppDataSource.getRepository(Document);
  const entities = await repo.find({ order: { updatedAt: 'DESC' } });
  const result = entities.map((entity) => ({
    id: entity.id,
    title: entity.title,
    region: entity.region ?? '',
    version: entity.version,
    status: entity.status as RegulatoryDocument['status'],
    owner: entity.owner ?? '',
    effectiveDate: entity.effectiveDate ?? '',
    updatedAt: entity.updatedAt.toISOString(),
  }));

  if (redisClient.isOpen) {
    await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
  }

  return result;
};

export const createDocument = async (payload: RegulatoryDocument) => {
  const parsed = documentSchema.parse(payload);
  const repo = AppDataSource.getRepository(Document);
  const document = repo.create(parsed);
  const saved = await repo.save(document);

  // Optional: ML classification enrichment (placeholder - assumes payload has content somewhere else)
  // In a real implementation you'd pass document text or metadata here.
  try {
    await classifyDocument(saved.title);
  } catch {
    // Swallow ML errors for now to keep core workflow resilient
  }

  if (redisClient.isOpen) {
    await redisClient.del('documents:list');
  }

  return saved;
};

