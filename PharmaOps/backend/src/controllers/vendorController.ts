import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as vendorService from '../services/vendorService';

export const getMyRequests = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.user?.userId;
    if (!vendorId) return res.status(401).json({ message: 'Unauthorized' });
    const orders = await vendorService.getMyRequests(vendorId);
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, title, product, s3Url, fileHash } = req.body;
    const uploadedById = req.user?.userId;
    if (!uploadedById) return res.status(401).json({ message: 'Unauthorized' });
    const doc = await vendorService.uploadDocument(orderId, title, product, uploadedById, s3Url, fileHash);
    res.status(201).json({ data: doc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createShipment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, product, lotNumber, quantity, origin, destination, eta } = req.body;
    const vendorId = req.user?.userId;
    if (!vendorId) return res.status(401).json({ message: 'Unauthorized' });
    const shipment = await vendorService.createShipment(orderId, product, lotNumber, quantity, origin, destination, eta);
    res.status(201).json({ data: shipment });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const checkOrderCompliance = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const vendorId = req.user?.userId;
    if (!vendorId) return res.status(401).json({ message: 'Unauthorized' });
    const compliant = await vendorService.checkOrderCompliance(orderId);
    res.json({ data: { compliant } });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
