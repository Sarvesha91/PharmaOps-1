import { AppDataSource } from './dataSource';
import { Document } from '../entities/Document';
import { Shipment } from '../entities/Shipment';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';
import { Role } from '../types/roles';

const JWT_SECRET = getEnv('JWT_SECRET', 'pharmaops-secret');

const run = async () => {
  // Print example JWTs for local development (no real users table yet)
  // These tokens encode role claims that the middleware will check.
  // Use them in the Authorization header as: Bearer <token>
  // Tokens expire in 30 days.
  // NOTE: These are intended for local development only.
  const adminToken = jwt.sign({ userId: 'admin1', role: Role.Admin }, JWT_SECRET, { expiresIn: '30d' });
  const qaToken = jwt.sign({ userId: 'qa1', role: Role.QA }, JWT_SECRET, { expiresIn: '30d' });
  const vendorToken = jwt.sign({ userId: 'vendor1', role: Role.Vendor }, JWT_SECRET, { expiresIn: '30d' });
  const auditorToken = jwt.sign({ userId: 'auditor1', role: Role.Auditor }, JWT_SECRET, { expiresIn: '30d' });
  // eslint-disable-next-line no-console
  console.log('Example JWTs (use in Authorization: Bearer <token>):');
  // eslint-disable-next-line no-console
  console.log('Admin:', adminToken);
  // eslint-disable-next-line no-console
  console.log('QA Reviewer:', qaToken);
  // eslint-disable-next-line no-console
  console.log('Vendor:', vendorToken);
  // eslint-disable-next-line no-console
  console.log('Auditor:', auditorToken);

  try {
    await AppDataSource.initialize();

    // Create test admin user with known password if not exists
    const userRepo = AppDataSource.getRepository('User');
    const existingAdmin = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (!existingAdmin) {
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash('Admin123!', 12);
      const adminUser = userRepo.create({
        email: 'admin@example.com',
        passwordHash,
        role: Role.Admin,
      });
      await userRepo.save(adminUser);
      console.log('Seeded admin user: admin@example.com with password "Admin123!"');
    } else {
      console.log('Admin user already exists');
    }

    const docRepo = AppDataSource.getRepository(Document);
    const shipRepo = AppDataSource.getRepository(Shipment);

    if ((await docRepo.count()) === 0) {
    await docRepo.save(
      docRepo.create([
        {
          title: 'EU GMP Annex 1 Update',
          region: 'EU',
          version: 'v7.2',
          status: 'approved',
          owner: 'QA Europe',
          effectiveDate: '2025-01-15',
        },
        {
          title: 'US FDA Labeling SOP',
          region: 'US',
          version: 'v5.0',
          status: 'in_review',
          owner: 'Regulatory Affairs',
          effectiveDate: '2025-02-10',
        },
      ]),
    );
  }

  if ((await shipRepo.count()) === 0) {
    await shipRepo.save(
      shipRepo.create([
        {
          product: 'mRNA Vial',
          lotNumber: 'A1B2C3',
          quantity: 12000,
          origin: 'Basel, CH',
          destination: 'Boston, US',
          status: 'IN_TRANSIT',
          eta: '2025-01-20',
        },
      ]),
    );
  }
    await AppDataSource.destroy();
  } catch (error: unknown) {
    // If DB isn't ready, we still printed tokens above. Log and exit gracefully.
    const msg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.warn('Seed database step skipped or failed (DB may not be ready):', msg);
  }
};

run().catch((error: unknown) => {
  const msg = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error('Seed script failed', msg);
  process.exit(1);
});


