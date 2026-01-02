import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as qaService from '../services/qaService';

export const getReviewQueue = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await qaService.getReviewQueue();
    res.json({ data: documents });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const approveDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId } = req.body;
    const approvedById = req.user?.userId;
    if (!approvedById) return res.status(401).json({ message: 'Unauthorized' });
    const doc = await qaService.approveDocument(documentId, approvedById);
    res.json({ data: doc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const rejectDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId, notes } = req.body;
    const qaId = req.user?.userId;
    if (!qaId) return res.status(401).json({ message: 'Unauthorized' });
    const doc = await qaService.rejectDocument(documentId, qaId, notes);
    res.json({ data: doc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const reviewDocumentSplitScreen = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId } = req.params;
    const qaId = req.user?.userId;
    if (!qaId) return res.status(401).json({ message: 'Unauthorized' });
    const reviewData = await qaService.reviewDocumentSplitScreen(documentId, qaId);
    res.json({ data: reviewData });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const approveDocumentWithSignature = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId, signature } = req.body;
    const qaId = req.user?.userId;
    if (!qaId) return res.status(401).json({ message: 'Unauthorized' });
    const doc = await qaService.approveDocumentWithSignature(documentId, qaId, signature);
    res.json({ data: doc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const rejectDocumentWithNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId, notes, signature } = req.body;
    const qaId = req.user?.userId;
    if (!qaId) return res.status(401).json({ message: 'Unauthorized' });
    const doc = await qaService.rejectDocumentWithNotes(documentId, qaId, notes, signature);
    res.json({ data: doc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getOrderReviewQueue = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await qaService.getOrderReviewQueue();
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
