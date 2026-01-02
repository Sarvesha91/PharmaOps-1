import { AppDataSource } from '../data/dataSource';
import { Order } from '../entities/Order';
import { Document } from '../entities/Document';
import { Shipment } from '../entities/Shipment';
import { User } from '../entities/User';
import { OrderDocumentStatus } from '../entities/OrderDocumentStatus';
import { AuditTrail } from '../entities/AuditTrail';
import { VendorProductAssignment } from '../entities/VendorProductAssignment';
import { anchorApprovedDocument, recordShipmentEventOnChain } from '../blockchain/provenanceClient';

export const getMyRequests = async (vendorId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const userRepo = AppDataSource.getRepository(User);

  const vendor = await userRepo.findOne({ where: { id: vendorId }, relations: ['company'] });
  if (!vendor || !vendor.company) throw new Error('Vendor or company not found');

  return await orderRepo.find({ where: { company: { id: vendor.company.id } }, relations: ['company', 'createdBy'] });
};

export const uploadDocument = async (orderId: string, title: string, product: string, uploadedById: string, s3Url?: string, fileHash?: string) => {
  const docRepo = AppDataSource.getRepository(Document);
  const userRepo = AppDataSource.getRepository(User);

  const uploadedBy = await userRepo.findOne({ where: { id: uploadedById } });
  if (!uploadedBy) throw new Error('User not found');

  const doc = docRepo.create({
    title,
    docType: 'TRANSACTIONAL',
    product,
    version: '1.0',
    status: 'draft',
    uploadedBy,
    s3Url,
    fileHash,
  });

  return await docRepo.save(doc);
};

export const checkOrderCompliance = async (orderId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const orderDocStatusRepo = AppDataSource.getRepository(OrderDocumentStatus);

  const order = await orderRepo.findOne({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');

  const statuses = await orderDocStatusRepo.find({ where: { order: { id: orderId } } });
  const allApproved = statuses.every(status => status.status === 'APPROVED');

  if (!allApproved) throw new Error('Order not compliant: not all documents approved');

  return true;
};

export const createShipment = async (orderId: string, product: string, lotNumber: string, quantity: number, origin: string, destination: string, eta: string) => {
  await checkOrderCompliance(orderId);

  const shipmentRepo = AppDataSource.getRepository(Shipment);
  const orderRepo = AppDataSource.getRepository(Order);

  const order = await orderRepo.findOne({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');

  const shipment = shipmentRepo.create({
    order,
    product,
    lotNumber,
    quantity,
    origin,
    destination,
    status: 'IN_TRANSIT',
    eta,
  });

  const savedShipment = await shipmentRepo.save(shipment);

  // Record shipment event on blockchain
  await recordShipmentEventOnChain(savedShipment.id, 'CREATED');

  return savedShipment;
};
