import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'vendor_profiles' })
export class VendorProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (u) => u.vendorProfile)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  companyName!: string;

  @Column({ nullable: true })
  licenseNumber?: string;

  @Column({ nullable: true })
  warehouseAddress?: string;
}
