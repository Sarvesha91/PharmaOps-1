import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from './Company';
import { User } from './User';
import { OrderDocumentStatus } from './OrderDocumentStatus';

export type OrderStatus = 'REQUESTED' | 'ACCEPTED' | 'DOCS_PENDING' | 'READY_TO_SHIP' | 'SHIPPED';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Company, { nullable: false })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User;

  @Column({ type: 'varchar', length: 32, default: 'REQUESTED' })
  status!: OrderStatus;

  @OneToMany(() => OrderDocumentStatus, (ods) => ods.order)
  documentStatuses!: OrderDocumentStatus[];
}
