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

export enum ProjectStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  SITE_INSPECTED = 'Site Inspected',
  AWAITING_DOCS = 'Awaiting Docs',
  REPORT_PREPARED = 'Report Prepared',
  COMPLETED = 'Completed',
  PAYMENT_PENDING = 'Payment Pending',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id', unique: true })
  projectId!: string;

  @Column({ name: 'property_address' })
  propertyAddress!: string;

  @Column()
  applicant!: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PENDING })
  status!: ProjectStatus;

  @Column({ name: 'requested_date', type: 'date', nullable: true })
  requestedDate!: string | null;

  @Column({ name: 'expected_completion', type: 'date', nullable: true })
  expectedCompletion!: string | null;

  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus!: PaymentStatus;

  @Column({ name: 'client_id' })
  clientId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Document, (document) => document.project)
  documents!: Document[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.project)
  teamMembers!: TeamMember[];
}
