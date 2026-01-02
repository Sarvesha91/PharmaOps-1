import React, { createContext, useContext, useState, type ReactNode } from 'react';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface Vendor {
  id: string;
  email: string;
  companyName: string;
  capacity: number;
  status: 'INVITED' | 'ACCEPTED' | 'ACTIVE';
  invitedAt: string;
  acceptedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface ComplianceRule {
  id: string;
  productId: string;
  requirement: string;
  docType: string;
  category: 'MASTER' | 'TRANSACTIONAL';
  createdAt: string;
}

export interface MasterSOP {
  id: string;
  productId: string;
  docType: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DocumentRequirement {
  id: string;
  docType: string;
  category: 'MASTER' | 'TRANSACTIONAL';
  status: 'MISSING' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  expiryDate?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  vendorId: string;
  productId: string;
  quantity: number;
  destination: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'DOCS_PENDING' | 'READY_TO_SHIP' | 'IN_TRANSIT' | 'DELIVERED';
  createdAt: string;
  acceptedAt?: string;
  requirements: DocumentRequirement[];
}

export interface Document {
  id: string;
  orderId: string;
  orderNumber: string;
  docType: string;
  vendorId: string;
  vendorName: string;
  fileName: string;
  uploadDate: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  fileHash?: string;
  blockchainTx?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  aiInsights?: {
    expiryMatch: boolean;
    batchMatch: boolean;
    qualityScore: number;
    flag: string | null;
  };
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  courier: string;
  status: 'IN_TRANSIT' | 'DELIVERED';
  location: string;
  lat: number;
  lng: number;
  createdAt: string;
  estimatedArrival?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    role: 'ADMIN' | 'QA' | 'VENDOR' | 'SYSTEM';
    id: string;
  };
  action: string;
  entity: string;
  changes: {
    oldValue?: unknown; // Fixed: replaced 'any'
    newValue?: unknown; // Fixed: replaced 'any'
  };
  blockchainHash?: string;
}

// New Interface to fix 'any' in timeline
export interface TimelineEvent {
  step: string;
  date: string;
  actor: string;
  status: string;
  hash?: string;
}

// =====================================================
// CONTEXT INTERFACE
// =====================================================

interface AppContextType {
  // State
  vendors: Vendor[];
  products: Product[];
  complianceRules: ComplianceRule[];
  masterSOPs: MasterSOP[];
  orders: Order[];
  documents: Document[];
  shipments: Shipment[];
  auditLogs: AuditLog[];

  // Admin Actions
  inviteVendor: (email: string, companyName: string, capacity: number) => void;
  defineComplianceRule: (productId: string, requirement: string, docType: string, category: 'MASTER' | 'TRANSACTIONAL') => void;
  uploadMasterSOP: (productId: string, docType: string, fileName: string) => void;
  createOrder: (vendorId: string, productId: string, quantity: number, destination: string) => void;

  // Vendor Actions
  acceptInvitation: (vendorId: string) => void;
  acceptOrder: (orderId: string) => void;
  uploadDocument: (orderId: string, docType: string, fileName: string) => void;
  createShipment: (orderId: string, trackingNumber: string, courier: string) => void;

  // QA Actions
  approveDocument: (docId: string, qaName: string, password: string, comments: string) => void;
  rejectDocument: (docId: string, qaName: string, reason: string) => void;

  // Utility
  getVendorById: (id: string) => Vendor | undefined;
  getProductById: (id: string) => Product | undefined;
  getOrderById: (id: string) => Order | undefined;
  getPendingDocuments: () => Document[];
  getOrderTimeline: (orderNumber: string) => TimelineEvent[]; // Fixed: replaced 'any[]'
}

// =====================================================
// CONTEXT CREATION
// =====================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fixed: ESLint warning about fast refresh with mixed exports
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// =====================================================
// PROVIDER COMPONENT
// =====================================================

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial Products (Pre-populated)
  const [products] = useState<Product[]>([
    { id: 'p1', name: 'Atenolol 50mg', category: 'Pharmaceutical' },
    { id: 'p2', name: 'Pharmaceutical Grade Ethanol', category: 'Chemical' },
    { id: 'p3', name: 'Industrial Steel Coils', category: 'Raw Material' },
    { id: 'p4', name: 'Microchip Processors', category: 'Electronics' },
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [masterSOPs, setMasterSOPs] = useState<MasterSOP[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // =====================================================
  // HELPER FUNCTIONS
  // =====================================================

  const generateId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  const generateHash = () => {
    return '0x' + Math.random().toString(16).substr(2, 10) + '...';
  };

  const generateFileHash = () => {
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  // Fixed: Replaced 'any' with 'Record<string, unknown>'
  const addAuditLog = (actor: AuditLog['actor'], action: string, entity: string, changes: Record<string, unknown>, includeHash = false) => {
    const log: AuditLog = {
      id: generateId('log'),
      timestamp: getTimestamp(),
      actor,
      action,
      entity,
      changes,
      blockchainHash: includeHash ? generateHash() : undefined,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // =====================================================
  // ADMIN ACTIONS
  // =====================================================

  const inviteVendor = (email: string, companyName: string, capacity: number) => {
    const vendor: Vendor = {
      id: generateId('v'),
      email,
      companyName,
      capacity,
      status: 'INVITED',
      invitedAt: getTimestamp(),
    };

    setVendors((prev) => [...prev, vendor]);
    addAuditLog(
      { name: 'Admin User', role: 'ADMIN', id: 'U-ADM-01' },
      'INVITED_VENDOR',
      `Vendor: ${companyName}`,
      { newValue: { email, companyName, capacity } }
    );
  };

  const defineComplianceRule = (productId: string, requirement: string, docType: string, category: 'MASTER' | 'TRANSACTIONAL') => {
    const rule: ComplianceRule = {
      id: generateId('rule'),
      productId,
      requirement,
      docType,
      category,
      createdAt: getTimestamp(),
    };

    setComplianceRules((prev) => [...prev, rule]);
    const product = products.find((p) => p.id === productId);
    addAuditLog(
      { name: 'Admin User', role: 'ADMIN', id: 'U-ADM-01' },
      'DEFINED_RULE',
      `Rule for ${product?.name}: ${docType}`,
      { newValue: { requirement, docType, category } }
    );
  };

  const uploadMasterSOP = (productId: string, docType: string, fileName: string) => {
    const sop: MasterSOP = {
      id: generateId('sop'),
      productId,
      docType,
      fileName,
      uploadedAt: getTimestamp(),
      uploadedBy: 'Admin User',
    };

    setMasterSOPs((prev) => [...prev, sop]);
    const product = products.find((p) => p.id === productId);
    addAuditLog(
      { name: 'Admin User', role: 'ADMIN', id: 'U-ADM-01' },
      'UPLOADED_MASTER_SOP',
      `Master SOP: ${docType} for ${product?.name}`,
      { newValue: { fileName, docType } }
    );
  };

  const createOrder = (vendorId: string, productId: string, quantity: number, destination: string) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    const product = products.find((p) => p.id === productId);
   
    if (!vendor || !product) {
      alert('Vendor or Product not found');
      return;
    }

    const orderNumber = `PO-${Date.now().toString().slice(-3)}`;
    const order: Order = {
      id: generateId('order'),
      orderNumber,
      vendorId,
      productId,
      quantity,
      destination,
      status: 'REQUESTED',
      createdAt: getTimestamp(),
      requirements: [],
    };

    setOrders((prev) => [...prev, order]);
    addAuditLog(
      { name: 'Admin User', role: 'ADMIN', id: 'U-ADM-01' },
      'CREATED_ORDER',
      `Order ${orderNumber}`,
      { newValue: { product: product.name, quantity, destination, vendor: vendor.companyName } }
    );
  };

  // =====================================================
  // VENDOR ACTIONS
  // =====================================================

  const acceptInvitation = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, status: 'ACCEPTED', acceptedAt: getTimestamp() }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    addAuditLog(
      { name: vendor?.companyName || 'Vendor', role: 'VENDOR', id: vendorId },
      'ACCEPTED_INVITATION',
      `Partnership with ${vendor?.companyName}`,
      { oldValue: { status: 'INVITED' }, newValue: { status: 'ACCEPTED' } }
    );
  };

  const acceptOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Generate requirements based on compliance rules
    const relevantRules = complianceRules.filter((r) => r.productId === order.productId);
    
    // Fixed: Changed 'let' to 'const' as the array reference isn't reassigned
    const requirements: DocumentRequirement[] = relevantRules.map((rule) => ({
        id: generateId('req'),
        docType: rule.docType,
        category: rule.category,
        status: 'MISSING',
        expiryDate: rule.category === 'MASTER' ? '2025-12-31' : undefined,
    }));

    // ALWAYS add these default transactional documents if not already present
    const defaultDocs = [
        { docType: 'Certificate of Analysis', category: 'TRANSACTIONAL' as const },
        { docType: 'Packing List', category: 'TRANSACTIONAL' as const }
    ];

    // Add default docs if they're not already in requirements
    defaultDocs.forEach(defaultDoc => {
        const exists = requirements.find(req => req.docType === defaultDoc.docType);
        if (!exists) {
        requirements.push({
            id: generateId('req'),
            docType: defaultDoc.docType,
            category: defaultDoc.category,
            status: 'MISSING',
        });
        }
    });

    // Add any MASTER category rules from masterSOPs that haven't been added yet
    const relevantMasterSOPs = masterSOPs.filter((sop) => sop.productId === order.productId);
    relevantMasterSOPs.forEach(sop => {
        const exists = requirements.find(req => req.docType === sop.docType);
        if (!exists) {
        requirements.push({
            id: generateId('req'),
            docType: sop.docType,
            category: 'MASTER',
            status: 'APPROVED', // Master SOPs are pre-approved
            expiryDate: '2026-12-31',
        });
        }
    });

    setOrders((prev) =>
        prev.map((o) =>
        o.id === orderId
            ? { ...o, status: 'DOCS_PENDING', acceptedAt: getTimestamp(), requirements }
            : o
        )
    );

    const vendor = vendors.find((v) => v.id === order.vendorId);
    addAuditLog(
        { name: vendor?.companyName || 'Vendor', role: 'VENDOR', id: order.vendorId },
        'ACCEPTED_ORDER',
        `Order ${order.orderNumber}`,
        { oldValue: { status: 'REQUESTED' }, newValue: { status: 'DOCS_PENDING' } }
    );
  };


  const uploadDocument = (orderId: string, docType: string, fileName: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const vendor = vendors.find((v) => v.id === order.vendorId);

    // Create document
    const doc: Document = {
      id: generateId('doc'),
      orderId: order.id,
      orderNumber: order.orderNumber,
      docType,
      vendorId: order.vendorId,
      vendorName: vendor?.companyName || 'Unknown Vendor',
      fileName,
      uploadDate: getTimestamp(),
      status: 'PENDING_REVIEW',
      priority: 'HIGH',
      aiInsights: {
        expiryMatch: true,
        batchMatch: true,
        qualityScore: Math.floor(Math.random() * 20) + 80, // 80-100
        flag: null,
      },
    };

    setDocuments((prev) => [...prev, doc]);

    // Update order requirement status
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              requirements: o.requirements.map((req) =>
                req.docType === docType ? { ...req, status: 'PENDING_REVIEW' } : req
              ),
            }
          : o
      )
    );

    addAuditLog(
      { name: vendor?.companyName || 'Vendor', role: 'VENDOR', id: order.vendorId },
      'UPLOADED_DOCUMENT',
      `${docType} for Order ${order.orderNumber}`,
      { newValue: { fileName, docType } }
    );
  };

  const createShipment = (orderId: string, trackingNumber: string, courier: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const vendor = vendors.find((v) => v.id === order.vendorId);

    const shipment: Shipment = {
      id: generateId('ship'),
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingNumber,
      courier,
      status: 'IN_TRANSIT',
      location: 'Mumbai Port Trust',
      lat: 18.9438,
      lng: 72.8541,
      createdAt: getTimestamp(),
      estimatedArrival: '2025-12-01',
    };

    setShipments((prev) => [...prev, shipment]);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'IN_TRANSIT' } : o))
    );

    addAuditLog(
      { name: vendor?.companyName || 'Vendor', role: 'VENDOR', id: order.vendorId },
      'CREATED_SHIPMENT',
      `Shipment for Order ${order.orderNumber}`,
      { newValue: { trackingNumber, courier } },
      true // Include blockchain hash
    );
  };

  // =====================================================
  // QA ACTIONS
  // =====================================================

  const approveDocument = (docId: string, qaName: string, password: string, comments: string) => {
    if (password !== 'password') {
      alert('Invalid signature password');
      return;
    }

    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const approvalDate = getTimestamp();
    const fileHash = generateFileHash();
    const blockchainTx = generateHash();

    // Update document
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: 'APPROVED',
              approvedBy: qaName,
              approvalDate,
              fileHash,
              blockchainTx,
            }
          : d
      )
    );

    // Update order requirement
    setOrders((prev) =>
      prev.map((o) =>
        o.id === doc.orderId
          ? {
              ...o,
              requirements: o.requirements.map((req) =>
                req.docType === doc.docType ? { ...req, status: 'APPROVED' } : req
              ),
            }
          : o
      )
    );

    // Check if all requirements are approved
    const order = orders.find((o) => o.id === doc.orderId);
    if (order) {
      // Create a temporary view of what the requirements look like AFTER this approval
      const updatedReqs = order.requirements.map((req) =>
        req.docType === doc.docType ? { ...req, status: 'APPROVED' as const } : req
      );
      
      const allApproved = updatedReqs.every((req) => req.status === 'APPROVED');

      if (allApproved) {
        setOrders((prev) =>
          prev.map((o) => (o.id === doc.orderId ? { ...o, status: 'READY_TO_SHIP' } : o))
        );
      }
    }

    addAuditLog(
      { name: qaName, role: 'QA', id: 'U-QA-01' },
      'APPROVED_DOCUMENT',
      `${doc.docType} for Order ${doc.orderNumber}`,
      // Fixed: included 'comments' to fix unused variable error
      { oldValue: { status: 'PENDING' }, newValue: { status: 'APPROVED', comments } },
      true // Include blockchain hash
    );
  };

  const rejectDocument = (docId: string, qaName: string, reason: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, status: 'REJECTED', rejectionReason: reason } : d
      )
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === doc.orderId
          ? {
              ...o,
              requirements: o.requirements.map((req) =>
                req.docType === doc.docType ? { ...req, status: 'MISSING' } : req
              ),
            }
          : o
      )
    );

    addAuditLog(
      { name: qaName, role: 'QA', id: 'U-QA-01' },
      'REJECTED_DOCUMENT',
      `${doc.docType} for Order ${doc.orderNumber}`,
      { oldValue: { status: 'PENDING' }, newValue: { status: 'REJECTED', reason } }
    );
  };

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  const getVendorById = (id: string) => vendors.find((v) => v.id === id);
  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getOrderById = (id: string) => orders.find((o) => o.id === id);
  const getPendingDocuments = () => documents.filter((d) => d.status === 'PENDING_REVIEW');

  // Fixed: Replaced 'any[]' return type with 'TimelineEvent[]'
  const getOrderTimeline = (orderNumber: string): TimelineEvent[] => {
    return auditLogs
      .filter((log) => log.entity.includes(orderNumber))
      .map((log) => ({
        step: log.action.replace(/_/g, ' '),
        date: log.timestamp,
        actor: log.actor.name,
        status: 'COMPLETED',
        hash: log.blockchainHash,
      }));
  };

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value: AppContextType = {
    vendors,
    products,
    complianceRules,
    masterSOPs,
    orders,
    documents,
    shipments,
    auditLogs,
    inviteVendor,
    defineComplianceRule,
    uploadMasterSOP,
    createOrder,
    acceptInvitation,
    acceptOrder,
    uploadDocument,
    createShipment,
    approveDocument,
    rejectDocument,
    getVendorById,
    getProductById,
    getOrderById,
    getPendingDocuments,
    getOrderTimeline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};