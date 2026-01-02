import 'reflect-metadata';
import { AppDataSource } from '../data/dataSource';
import { Company } from '../entities/Company';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { DocumentRequirement } from '../entities/DocumentRequirement';
import { Order } from '../entities/Order';

const run = async () => {
  await AppDataSource.initialize();

  const companyRepo = AppDataSource.getRepository(Company);
  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);
  const reqRepo = AppDataSource.getRepository(DocumentRequirement);
  const orderRepo = AppDataSource.getRepository(Order);

  let company = await companyRepo.findOne({ where: { name: 'ACME Corp' } });
  if (!company) {
    company = companyRepo.create({ name: 'ACME Corp' });
    await companyRepo.save(company);
  }

  let user = await userRepo.findOne({ where: { email: 'dev@acme.local' } });
  if (!user) {
    user = userRepo.create({ email: 'dev@acme.local', role: 'ADMIN' as any });
    await userRepo.save(user);
  }

  let product = await productRepo.findOne({ where: { name: 'Test Product' } });
  if (!product) {
    product = productRepo.create({ name: 'Test Product' });
    await productRepo.save(product);
  }

  let req = await reqRepo.findOne({ where: { name: 'COA' } });
  if (!req) {
    req = reqRepo.create({ name: 'COA', product });
    await reqRepo.save(req);
  }

  let order = await orderRepo.findOne({ where: { company: { id: company.id } } });
  if (!order) {
    order = orderRepo.create({ company, createdBy: user, status: 'DRAFT' as any });
    await orderRepo.save(order);
  }

  // eslint-disable-next-line no-console
  console.log('Test order id:', order.id);

  await AppDataSource.destroy();
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
