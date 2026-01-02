import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { VendorProfile } from './VendorProfile';

export type UserRole = 'admin' | 'vendor' | 'qa_reviewer' | 'auditor';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ type: 'varchar', default: 'vendor' })
  role!: UserRole;

  @ManyToOne(() => Company, (c) => c.users, { nullable: true })
  company?: Company;

  @OneToOne(() => VendorProfile, (p) => p.user, { nullable: true })
  @JoinColumn()
  vendorProfile?: VendorProfile;
}
