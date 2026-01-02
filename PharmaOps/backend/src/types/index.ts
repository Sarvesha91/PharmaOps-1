export type RegulatoryDocument = {
  id: string;
  title: string;
  region: string;
  version: string;
  status: 'draft' | 'in_review' | 'approved' | 'retired';
  owner: string;
  effectiveDate: string;
  updatedAt: string;
};

export type ShipmentTelemetry = {
  temperatureC: number;
  location: string;
  timestamp: string;
};

export type Shipment = {
  id: string;
  product: string;
  lotNumber: string;
  quantity: number;
  origin: string;
  destination: string;
  status: 'in_transit' | 'delayed' | 'delivered' | 'exception';
  eta: string;
  telemetry: ShipmentTelemetry;
};

