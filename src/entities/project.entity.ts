import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Document } from './document.entity';
import { TeamMember } from './team-member.entity';
import { Invoice } from './invoice.entity';

export enum ProjectStatus {
  SITE_INSPECTED = 'Site Inspected',
  AWAITING_DOCS = 'Awaiting Docs',
  COMPLETED = 'Completed',
  PAYMENT_PENDING = 'Payment Pending',
  REPORT_PREPARED = 'Report Prepared',
  IN_PROGRESS = 'In Progress',
}

export enum PaymentStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id', unique: true })
  projectId!: string;

  @Column({ name: 'property_address' })
  propertyAddress!: string;

  @Column({ type: 'varchar', nullable: true })
  applicant!: string | null;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.IN_PROGRESS,
  })
  status!: ProjectStatus;

  @Column({ name: 'requested_date', type: 'date' })
  requestedDate!: Date;

  @Column({ name: 'expected_completion', type: 'date' })
  expectedCompletion!: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    name: 'payment_status',
  })
  paymentStatus!: PaymentStatus;

  @Column({ name: 'client_id', type: 'varchar', nullable: true })
  clientId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Document, (document) => document.project)
  documents!: Document[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.project)
  teamMembers!: TeamMember[];

  @OneToMany(() => Invoice, (invoice) => invoice.project)
  invoices!: Invoice[];
}
