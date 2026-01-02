import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity({ name: 'vendor_product_assignments' })
export class VendorProductAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'vendorUserId' })
  vendor!: User;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ default: false })
  isMasterLicenseValid!: boolean;
}
