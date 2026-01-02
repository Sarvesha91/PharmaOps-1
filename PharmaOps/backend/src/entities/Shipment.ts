import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order';

export type ShipmentStatus = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED';

@Entity({ name: 'shipments' })
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column()
  product!: string;

  @Column()
  lotNumber!: string;

  @Column()
  quantity!: number;

  @Column()
  origin!: string;

  @Column()
  destination!: string;

  @Column({ type: 'enum', enum: ['CREATED', 'IN_TRANSIT', 'DELIVERED'], default: 'CREATED' })
  status!: ShipmentStatus;

  @Column({ type: 'date' })
  eta!: string;

  @Column('jsonb', { nullable: true })
  telemetry?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

