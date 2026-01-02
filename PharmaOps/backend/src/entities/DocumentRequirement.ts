import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity({ name: 'document_requirements' })
export class DocumentRequirement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  requiredForExport!: boolean;

  @Column({ nullable: true })
  country?: string;
}
