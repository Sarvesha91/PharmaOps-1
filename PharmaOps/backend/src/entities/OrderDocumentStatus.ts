import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order';
import { Document } from './Document';

export type DocumentCheckStatus = 'MISSING' | 'PENDING' | 'APPROVED' | 'REJECTED';

@Entity({ name: 'order_document_statuses' })
export class OrderDocumentStatus {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Document, { nullable: true })
  @JoinColumn({ name: 'documentId' })
  document?: Document | null;

  @Column({ type: 'varchar', length: 16, default: 'MISSING' })
  status!: DocumentCheckStatus;

  @Column({ nullable: true })
  notes?: string;
}
