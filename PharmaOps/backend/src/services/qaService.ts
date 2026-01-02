import { AppDataSource } from '../data/dataSource';
import { Document } from '../entities/Document';
import { User } from '../entities/User';
import { Order } from '../entities/Order';
import { OrderDocumentStatus } from '../entities/OrderDocumentStatus';
import { AuditTrail } from '../entities/AuditTrail';
import { anchorApprovedDocument } from '../blockchain/provenanceClient';

export const getReviewQueue = async () => {
  const docRepo = AppDataSource.getRepository(Document);
  return await docRepo.find({
    where: { status: 'draft' },
    relations: ['uploadedBy']
  });
};

export const approveDocument = async (documentId: string, approvedById: string) => {
  const docRepo = AppDataSource.getRepository(Document);
  const userRepo = AppDataSource.getRepository(User);
  const orderDocStatusRepo = AppDataSource.getRepository(OrderDocumentStatus);

  const doc = await docRepo.findOne({ where: { id: documentId } });
  if (!doc) throw new Error('Document not found');

  const approvedBy = await userRepo.findOne({ where: { id: approvedById } });
  if (!approvedBy) throw new Error('User not found');

  doc.status = 'approved';
  doc.approvedBy = approvedBy;

  // Update OrderDocumentStatus if linked
  const orderDocStatus = await orderDocStatusRepo.findOne({
    where: { document: { id: documentId } }
  });
  if (orderDocStatus) {
    orderDocStatus.status = 'APPROVED';
    await orderDocStatusRepo.save(orderDocStatus);
  }

  return await docRepo.save(doc);
};

export const rejectDocument = async (documentId: string, approvedById: string, notes?: string) => {
  const docRepo = AppDataSource.getRepository(Document);
  const userRepo = AppDataSource.getRepository(User);
  const orderDocStatusRepo = AppDataSource.getRepository(OrderDocumentStatus);

  const doc = await docRepo.findOne({ where: { id: documentId } });
  if (!doc) throw new Error('Document not found');

  const approvedBy = await userRepo.findOne({ where: { id: approvedById } });
  if (!approvedBy) throw new Error('User not found');

  doc.status = 'rejected';
  doc.approvedBy = approvedBy;

  // Update OrderDocumentStatus if linked
  const orderDocStatus = await orderDocStatusRepo.findOne({
    where: { document: { id: documentId } }
  });
  if (orderDocStatus) {
    orderDocStatus.status = 'REJECTED';
    orderDocStatus.notes = notes;
    await orderDocStatusRepo.save(orderDocStatus);
  }

  return await docRepo.save(doc);
};

export const getOrderReviewQueue = async () => {
  const orderRepo = AppDataSource.getRepository(Order);
  return await orderRepo.find({
    where: { status: 'DOCS_PENDING' },
    relations: ['company', 'createdBy', 'documentStatuses', 'documentStatuses.documentRequirement']
  });
};

export const reviewDocumentSplitScreen = async (documentId: string, qaId: string) => {
  const docRepo = AppDataSource.getRepository(Document);
  const userRepo = AppDataSource.getRepository(User);

  const doc = await docRepo.findOne({ where: { id: documentId }, relations: ['uploadedBy'] });
  if (!doc) throw new Error('Document not found');

  const qa = await userRepo.findOne({ where: { id: qaId, role: 'qa_reviewer' } });
  if (!qa) throw new Error('QA not found');

  // Return document with uploaded version for split-screen review
  return {
    document: doc,
    uploadedBy: doc.uploadedBy,
    qa: qa
  };
};

export const approveDocumentWithSignature = async (documentId: string, qaId: string, signature: string) => {
  const docRepo = AppDataSource.getRepository(Document);
  const userRepo = AppDataSource.getRepository(User);
  const orderDocStatusRepo = AppDataSource.getRepository(OrderDocumentStatus);
  const auditRepo = AppDataSource.getRepository(AuditTrail);

  const doc = await docRepo.findOne({ where: { id: documentId } });
  if (!doc) throw new Error('Document not found');

  const qa = await userRepo.findOne({ where: { id: qaId, role: 'qa_reviewer' } });
  if (!qa) throw new Error('QA not found');

  doc.status = 'approved';
  doc.approvedBy = qa;
  doc.signature = signature; // Assuming Document entity has signature field

  // Update OrderDocumentStatus if linked
  const orderDocStatus = await orderDocStatusRepo.findOne({
    where: { document: { id: documentId } }
  });
  if (orderDocStatus) {
    orderDocStatus.status = 'APPROVED';
    await orderDocStatusRepo.save(orderDocStatus);
  }

  const savedDoc = await docRepo.save(doc);

  // Log audit
  const audit = auditRepo.create({
    action: 'APPROVE_DOCUMENT',
    performedBy: qa,
    details: { documentId, signature }
  });
  await auditRepo.save(audit);

  // Anchor approved document
  await anchorApprovedDocument(documentId, 'document');

  return savedDoc;
};

export const rejectDocumentWithNotes = async (documentId: string, qaId: string, notes: string, signature: string) => {
  const docRepo = AppDataSource.getRepository(Document);
  const userRepo = AppDataSource.getRepository(User);
  const orderDocStatusRepo = AppDataSource.getRepository(OrderDocumentStatus);
  const auditRepo = AppDataSource.getRepository(AuditTrail);

  const doc = await docRepo.findOne({ where: { id: documentId } });
  if (!doc) throw new Error('Document not found');

  const qa = await userRepo.findOne({ where: { id: qaId, role: 'qa_reviewer' } });
  if (!qa) throw new Error('QA not found');

  doc.status = 'rejected';
  doc.approvedBy = qa;
  doc.signature = signature;

  // Update OrderDocumentStatus if linked
  const orderDocStatus = await orderDocStatusRepo.findOne({
    where: { document: { id: documentId } }
  });
  if (orderDocStatus) {
    orderDocStatus.status = 'REJECTED';
    orderDocStatus.notes = notes;
    await orderDocStatusRepo.save(orderDocStatus);
  }

  const savedDoc = await docRepo.save(doc);

  // Log audit
  const audit = auditRepo.create({
    action: 'REJECT_DOCUMENT',
    performedBy: qa,
    details: { documentId, notes, signature }
  });
  await auditRepo.save(audit);

  return savedDoc;
};
