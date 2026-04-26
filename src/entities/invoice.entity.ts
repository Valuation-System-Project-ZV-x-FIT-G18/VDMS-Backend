import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

export enum InvoiceStatus {
  OVERDUE = 'Overdue',
  PENDING = 'Pending',
  PAID = 'Paid',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'invoice_id', unique: true })
  invoiceId!: string;

  @Column({ name: 'project_id' })
  projectId!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate!: Date;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status!: InvoiceStatus;

  @Column({ name: 'payment_proof_file_name', type: 'varchar', nullable: true })
  paymentProofFileName!: string | null;

  @Column({
    name: 'payment_proof_uploaded_at',
    type: 'timestamp',
    nullable: true,
  })
  paymentProofUploadedAt!: Date | null;

  @Column({
    name: 'coordinator_notified_at',
    type: 'timestamp',
    nullable: true,
  })
  coordinatorNotifiedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;
}
