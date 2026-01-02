import type { Request, Response } from 'express';

import * as documentService from '../services/documentService';

export const getDocuments = async (_req: Request, res: Response) => {
  const documents = await documentService.listDocuments();
  res.json({ data: documents });
};

export const postDocument = async (req: Request, res: Response) => {
  const document = await documentService.createDocument(req.body);
  res.status(201).json({ data: document });
};

