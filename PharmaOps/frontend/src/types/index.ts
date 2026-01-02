export type RegulatoryDocument = {
  id: string;
  title: string;
  country: string;
  category: 'SOP' | 'Labeling' | 'Validation' | 'Submission';
  version: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Retired';
  effectiveDate: string;
  owner: string;
  lastUpdated: string;
};

export type ShipmentTelemetry = {
  temperatureC: number;
  lastScannedAt: string;
  location: string;
};

export type Shipment = {
  id: string;
  product: string;
  lotNumber: string;
  quantity: number;
  origin: string;
  destination: string;
  eta: string;
  status: 'In Transit' | 'Delayed' | 'Delivered' | 'Exception';
  telemetry: ShipmentTelemetry;
};

