import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'audit_trail' })
export class AuditTrail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  action!: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: any;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'performedBy' })
  performedBy?: User | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
