import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Document } from './Document';

@Entity({ name: 'blockchain_anchors' })
export class BlockchainAnchor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Document, { nullable: false })
  @JoinColumn({ name: 'documentId' })
  document!: Document;

  @Column()
  txHash!: string;

  @Column()
  network!: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  anchoredAt!: Date;
}
