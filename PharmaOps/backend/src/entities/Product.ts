import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Company } from './Company';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  sku?: string;

  @ManyToOne(() => Company, { nullable: true })
  company?: Company;
}
