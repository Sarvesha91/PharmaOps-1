import { AppDataSource } from '../data/dataSource';
import { AuditTrail } from '../entities/AuditTrail';
import { Document } from '../entities/Document';
import { Order } from '../entities/Order';
import { BlockchainAnchor } from '../entities/BlockchainAnchor';

export const getAuditLogs = async () => {
  const auditRepo = AppDataSource.getRepository(AuditTrail);
  return await auditRepo.find({ relations: ['performedBy'], order: { createdAt: 'DESC' } });
};

export const getEvidencePacks = async () => {
  const docRepo = AppDataSource.getRepository(Document);
  return await docRepo.find({ where: { status: 'approved' }, relations: ['uploadedBy', 'approvedBy'] });
};

export const generateEvidencePack = async (orderId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const docRepo = AppDataSource.getRepository(Document);
  const auditRepo = AppDataSource.getRepository(AuditTrail);
  const anchorRepo = AppDataSource.getRepository(BlockchainAnchor);

  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: ['company', 'createdBy', 'documentStatuses', 'documentStatuses.documentRequirement']
  });
  if (!order) throw new Error('Order not found');

  const documents = await docRepo.find({
    where: { product: order.company.name }, // Assuming product is linked via company
    relations: ['uploadedBy', 'approvedBy']
  });

  const audits = await auditRepo.find({
    where: { details: { entityId: orderId } },
    relations: ['performedBy']
  });

  const anchors = await anchorRepo.find({
    where: { document: { product: order.company.name } }
  });

  return {
    order,
    documents,
    audits,
    blockchainAnchors: anchors
  };
};

export const queryAuditTrail = async (filters: any) => {
  const auditRepo = AppDataSource.getRepository(AuditTrail);
  return await auditRepo.find({
    where: filters,
    relations: ['performedBy'],
    order: { createdAt: 'DESC' }
  });
};
