import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as adminService from '../services/adminService';

import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as adminService from '../services/adminService';

export const inviteVendor = async (req: AuthRequest, res: Response) => {
  try {
    const { email, companyName, productIds } = req.body;
    const adminId = req.user?.userId;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await adminService.inviteVendor(email, companyName, productIds, adminId);
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const defineRequirements = async (req: Request, res: Response) => {
  try {
    const { productId, name, description, requiredForExport } = req.body;
    const reqDoc = await adminService.defineRequirements(productId, name, description, requiredForExport);
    res.status(201).json({ data: reqDoc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// New: Get list of vendors (users with role vendor)
export const getVendors = async (_req: Request, res: Response) => {
  try {
    const vendors = await adminService.getVendors();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// New: Get list of products
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await adminService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// New: Get dashboard stats
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


export const uploadMasterDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { title, product, region, s3Url, fileHash } = req.body;
    const uploadedById = req.user?.userId;
    if (!uploadedById) return res.status(401).json({ message: 'Unauthorized' });
    const doc = await adminService.uploadMasterDocument(title, product, region, uploadedById, s3Url, fileHash);
    res.status(201).json({ data: doc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.body;
    const createdById = req.user?.userId;
    if (!createdById) return res.status(401).json({ message: 'Unauthorized' });
    const order = await adminService.createRequest(companyId, createdById);
    res.status(201).json({ data: order });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getTracking = async (_req: Request, res: Response) => {
  try {
    const shipments = await adminService.getTracking();
    res.json({ data: shipments });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const acceptOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const adminId = req.user?.userId;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
    const order = await adminService.acceptOrder(orderId, adminId);
    res.json({ data: order });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const assignVendorToProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { vendorId, productId } = req.body;
    const adminId = req.user?.userId;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
    const assignment = await adminService.assignVendorToProduct(vendorId, productId, adminId);
    res.status(201).json({ data: assignment });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const generateChecklist = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const checklist = await adminService.generateChecklist(orderId);
    res.json({ data: checklist });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const checkCompliance = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const compliant = await adminService.checkCompliance(orderId);
    res.json({ data: { compliant } });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, status } = req.body;
    const adminId = req.user?.userId;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
    const order = await adminService.updateOrderStatus(orderId, status, adminId);
    res.json({ data: order });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const anchorOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const adminId = req.user?.userId;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
    const result = await adminService.anchorOrder(orderId);
    res.json({ data: result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
