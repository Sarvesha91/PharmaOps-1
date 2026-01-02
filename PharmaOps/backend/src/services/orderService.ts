import { AppDataSource } from '../data/dataSource';
import { Order } from '../entities/Order';
import { OrderDocumentStatus, DocumentCheckStatus } from '../entities/OrderDocumentStatus';
import { DocumentRequirement } from '../entities/DocumentRequirement';
import { Document } from '../entities/Document';
import { AuditTrail } from '../entities/AuditTrail';

export const generateOrderChecklist = async (orderId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const odsRepo = AppDataSource.getRepository(OrderDocumentStatus);
  const productReqRepo = AppDataSource.getRepository(DocumentRequirement);

  const order = await orderRepo.findOne({ where: { id: orderId }, relations: ['company'] });
  if (!order) throw new Error('Order not found');

  // For simplicity assume order.company has products; here we fetch all requirements globally
  const reqs = await productReqRepo.find({ relations: ['product'] });

  // Create missing OrderDocumentStatus rows for each requirement
  const items: OrderDocumentStatus[] = [];
  for (const req of reqs) {
    const ods = odsRepo.create({ order, status: 'MISSING', document: null });
    items.push(ods);
  }

  if (items.length) {
    await odsRepo.save(items);
  }

  const persisted = await odsRepo.find({ where: { order: { id: orderId } }, relations: ['document'] });
  return persisted.map((p) => ({ id: p.id, status: p.status, documentId: p.document?.id ?? null, notes: p.notes ?? '' }));
};

export const acceptOrderIfCompliant = async (orderId: string, performedById?: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const odsRepo = AppDataSource.getRepository(OrderDocumentStatus);
  const auditRepo = AppDataSource.getRepository(AuditTrail);

  const order = await orderRepo.findOne({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');

  const docs = await odsRepo.find({ where: { order: { id: orderId } } });
  const allApproved = docs.every((d) => d.status === 'APPROVED');
  if (!allApproved) {
    return { ok: false, reason: 'Not all documents approved' };
  }

  order.status = 'READY_TO_SHIP';
  await orderRepo.save(order);

  await auditRepo.save(auditRepo.create({ action: 'ORDER_ACCEPTED', details: { orderId }, performedBy: performedById ? { id: performedById } as any : undefined }));

  return { ok: true };
};
