import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ApprovalStatus { PENDING = 'Pending', APPROVED = 'Approved', REJECTED = 'Rejected' }
export enum ApprovalType { 
  DOCUMENT_REVIEW = 'Document Review',
  REPORT_APPROVAL = 'Report Approval',
  PAYMENT_AUTHORIZATION = 'Payment Authorization',
  PROJECT_COMPLETION = 'Project Completion'
}

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() projectId!: string;
  @Column() managerId!: string;
  @Column({ default: 'DOCUMENT_REVIEW' }) approvalType!: string;
  @Column({ default: 'PENDING' }) status!: string;
  @Column({ nullable: true, type: 'text' }) comments!: string;
  @Column({ default: 'Medium' }) priority!: string;
  @Column({ nullable: true }) submittedBy!: string;
  @Column({ nullable: true }) submittedDate!: string;
  @Column({ nullable: true }) processedAt!: Date;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}