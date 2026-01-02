export enum Role {
  Admin = 'admin',
  QA = 'qa_reviewer',
  Vendor = 'vendor',
  Auditor = 'auditor',
}

export type UserPayload = {
  userId?: string;
  role?: Role | string;
  [key: string]: unknown;
};
