import { AppDataSource } from '../data/dataSource';
import { User, UserRole } from '../entities/User';
import { DocumentRequirement } from '../entities/DocumentRequirement';
import { Document } from '../entities/Document';
import { Order, OrderStatus } from '../entities/Order';
import { Shipment } from '../entities/Shipment';
import { Company } from '../entities/Company';
import { Product } from '../entities/Product';
import { VendorProductAssignment } from '../entities/VendorProductAssignment';
import { DocumentCheckStatus, OrderDocumentStatus } from '../entities/OrderDocumentStatus';
import { AuditTrail } from '../entities/AuditTrail';
import { anchorApprovedDocument } from '../blockchain/provenanceClient';

export const inviteVendor = async (email: string, companyName: string, productIds: string[], adminId: string) => {
  const userRepo = AppDataSource.getRepository(User);
  const companyRepo = AppDataSource.getRepository(Company);
  const productRepo = AppDataSource.getRepository(Product);
  const assignmentRepo = AppDataSource.getRepository(VendorProductAssignment);
  const auditRepo = AppDataSource.getRepository(AuditTrail);

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) throw new Error('User already exists');

  // Create or find company
  let company = await companyRepo.findOne({ where: { name: companyName } });
  if (!company) {
    company = companyRepo.create({ name: companyName });
    company = await companyRepo.save(company);
  }

  // Create user
  const user = userRepo.create({
    email,
    role: 'vendor',
    company,
  });
  const savedUser = await userRepo.save(user);

  // Assign products
  for (const productId of productIds) {
    const product = await productRepo.findOne({ where: { id: productId } });
    if (!product) throw new Error(`Product ${productId} not found`);
    const assignment = assignmentRepo.create({
      vendor: savedUser,
      product,
    });
    await assignmentRepo.save(assignment);
  }

  // Log audit
  const admin = await userRepo.findOne({ where: { id: adminId } });
  if (admin) {
    const audit = auditRepo.create({
      action: 'INVITE_VENDOR',
      performedBy: admin,
      details: { email, companyName, productIds },
    });
    await auditRepo.save(audit);
  }

  return savedUser;
};

export const defineRequirements = async (productId: string, name: string, description?: string, requiredForExport: boolean = false) => {
  const reqRepo = AppDataSource.getRepository(DocumentRequirement);
  const productRepo = AppDataSource.getRepository(Product);

  const product = await productRepo.findOne({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  const req = reqRepo.create({
    product,
    name,
    description,
    requiredForExport,
  });

  return await reqRepo.save(req);
};

export const uploadMasterDocument = async (title: string, product: string, region: string, uploadedById: string, s3Url?: string, fileHash?: string) => {
  const docRepo = AppDataSource.getRepository(Document);
  const userRepo = AppDataSource.getRepository(User);

  const uploadedBy = await userRepo.findOne({ where: { id: uploadedById } });
  if (!uploadedBy) throw new Error('User not found');

  const doc = docRepo.create({
    title,
    docType: 'MASTER',
    product,
    region,
    version: '1.0',
    status: 'draft',
    uploadedBy,
    s3Url,
    fileHash,
  });

  return await docRepo.save(doc);
};

export const createRequest = async (companyId: string, createdById: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const companyRepo = AppDataSource.getRepository(Company);
  const userRepo = AppDataSource.getRepository(User);

  const company = await companyRepo.findOne({ where: { id: companyId } });
  if (!company) throw new Error('Company not found');

  const createdBy = await userRepo.findOne({ where: { id: createdById } });
  if (!createdBy) throw new Error('User not found');

  const order = orderRepo.create({
    company,
    createdBy,
    status: 'REQUESTED',
  });

  return await orderRepo.save(order);
};

export const getTracking = async () => {
  const shipmentRepo = AppDataSource.getRepository(Shipment);
  return await shipmentRepo.find();
};

export const acceptOrder = async (orderId: string, adminId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const userRepo = AppDataSource.getRepository(User);

  const order = await orderRepo.findOne({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');

  const admin = await userRepo.findOne({ where: { id: adminId, role: 'admin' } });
  if (!admin) throw new Error('Admin not found');

  order.status = 'ACCEPTED';
  return await orderRepo.save(order);
};

export const assignVendorToProduct = async (vendorId: string, productId: string, adminId: string) => {
  const assignmentRepo = AppDataSource.getRepository(VendorProductAssignment);
  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);

  const vendor = await userRepo.findOne({ where: { id: vendorId, role: 'vendor' } });
  if (!vendor) throw new Error('Vendor not found');

  const product = await productRepo.findOne({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  const admin = await userRepo.findOne({ where: { id: adminId, role: 'admin' } });
  if (!admin) throw new Error('Admin not found');

  const assignment = assignmentRepo.create({
    vendor,
    product,
  });

  return await assignmentRepo.save(assignment);
};

export const generateChecklist = async (orderId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const reqRepo = AppDataSource.getRepository(DocumentRequirement);
  const orderDocStatusRepo = AppDataSource.getRepository(OrderDocumentStatus);

  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: ['company']
  });
  if (!order) throw new Error('Order not found');

  // Get requirements for the order's company products (assuming products are linked via company)
  const requirements = await reqRepo.find({
    where: { product: { company: { id: order.company.id } } },
    relations: ['product']
  });

  const checklist = requirements.map(req => ({
    requirementId: req.id,
    name: req.name,
    description: req.description,
    requiredForExport: req.requiredForExport,
    country: req.country,
    status: 'PENDING'
  }));

  // Create OrderDocumentStatus entries
  for (const item of checklist) {
    const status = orderDocStatusRepo.create({
      order,
      status: item.status as DocumentCheckStatus
    });
    await orderDocStatusRepo.save(status);
  }

  return checklist;
};

export const checkCompliance = async (orderId: string) => {
  const orderDocStatusRepo = AppDataSource.getRepository(OrderDocumentStatus);

  const statuses = await orderDocStatusRepo.find({
    where: { order: { id: orderId } }
  });

  return statuses.every(s => s.status === 'APPROVED');
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus, adminId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const userRepo = AppDataSource.getRepository(User);
  const auditRepo = AppDataSource.getRepository(AuditTrail);

  const order = await orderRepo.findOne({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');

  const admin = await userRepo.findOne({ where: { id: adminId, role: 'admin' } });
  if (!admin) throw new Error('Admin not found');

  const oldStatus = order.status;
  order.status = status;
  await orderRepo.save(order);

  const audit = auditRepo.create({
    action: 'UPDATE_ORDER_STATUS',
    performedBy: admin,
    details: { entityType: 'Order', entityId: orderId, oldStatus, newStatus: status }
  });
  await auditRepo.save(audit);

  return order;
};

import { AppDataSource } from '../data/dataSource';
import { User, UserRole } from '../entities/User';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { DocumentRequirement } from '../entities/DocumentRequirement';
import { Shipment } from '../entities/Shipment';

export const anchorOrder = async (orderId: string) => {
  return await anchorApprovedDocument(orderId, 'order');
};

// New: Get list of vendors (users with role vendor)
export const getVendors = async () => {
  const userRepo = AppDataSource.getRepository(User);
  const vendors = await userRepo.find({
    where: { role: 'vendor' },
    relations: ['company', 'vendorProfile']
  });
  // Return a simplified JSON-friendly array
  return vendors.map(v => ({
    id: v.id,
    email: v.email,
    companyName: v.company?.name || '',
    products: v.vendorProfile ? v.vendorProfile.assignedProductIds || [] : []
  }));
};

// New: Get list of products
export const getProducts = async () => {
  const productRepo = AppDataSource.getRepository(Product);
  const products = await productRepo.find();
  return products.map(p => ({
    id: p.id,
    name: p.name,
  }));
};

// New: Get dashboard stats (example implementation)
export const getDashboardStats = async () => {
  const docReqRepo = AppDataSource.getRepository(DocumentRequirement);
  const orderRepo = AppDataSource.getRepository(Order);
  const shipmentRepo = AppDataSource.getRepository(Shipment);

  // Count docs pending - for simplicity use DocumentRequirement count as proxy
  const docsPending = await docReqRepo.count();

  // Count orders ready to ship (status = 'READY') - adjust status as per your enum/strings
  const readyToShip = await orderRepo.count({ where: { status: 'READY' } });

  // Count shipments in transit (status = 'IN_TRANSIT')
  const inTransit = await shipmentRepo.count({ where: { status: 'IN_TRANSIT' } });

  return {
    docsPending,
    readyToShip,
    inTransit,
  };
};
