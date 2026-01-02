import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'enum', enum: ['MASTER', 'TRANSACTIONAL'], nullable: true })
  docType?: 'MASTER' | 'TRANSACTIONAL';

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  product?: string;

  @Column({ nullable: true })
  storageTag?: string;

  @Column()
  version!: string;

  @Column({ default: 'draft' })
  status!: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  owner?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploadedBy' })
  uploadedBy?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approvedBy' })
  approvedBy?: User;

  @Column({ type: 'date', nullable: true })
  expiryDate?: string;

  @Column({ nullable: true })
  effectiveDate?: string;

  @Column({ nullable: true })
  s3Url?: string;

  @Column({ nullable: true })
  fileHash?: string;

  @Column({ nullable: true })
  signature?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

