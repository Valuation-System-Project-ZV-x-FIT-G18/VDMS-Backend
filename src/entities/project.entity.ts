import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProjectStatus {
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  REPORT_PREPARED = 'Report Prepared',
  PAYMENT_PENDING = 'Payment Pending',
  SITE_INSPECTED = 'Site Inspected',
  AWAITING_DOCS = 'Awaiting Docs'
}
export enum PaymentStatus { PENDING = 'Pending', PAID = 'Paid', OVERDUE = 'Overdue' }

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true }) projectId!: string;
  @Column() propertyAddress!: string;
  @Column({ nullable: true }) applicant!: string;
  @Column({ default: 'In Progress' }) status!: string;
  @Column({ nullable: true }) requestedDate!: string;
  @Column({ nullable: true }) expectedCompletion!: string;
  @Column({ default: 'Pending' }) paymentStatus!: string;
  @Column({ nullable: true }) technicalOfficer!: string;
  @Column({ nullable: true }) coordinator!: string;
  @Column({ nullable: true }) valuationType!: string;
  @Column({ nullable: true, type: 'decimal' }) finalValue!: number;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}