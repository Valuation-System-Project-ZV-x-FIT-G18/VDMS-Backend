import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TechnicalOfficerProject } from './technical-officer-project.entity';

@Entity('technical_officer_reports')
export class TechnicalOfficerReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => TechnicalOfficerProject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: TechnicalOfficerProject;

  @Column({ name: 'report_title' })
  reportTitle!: string;

  @Column({ name: 'inspection_notes', type: 'text' })
  inspectionNotes!: string;

  @Column({ name: 'valuation_summary', type: 'text' })
  valuationSummary!: string;

  @Column({ type: 'text' })
  recommendation!: string;

  @Column({ default: 'Draft' })
  status!: string;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason!: string | null;

  @Column({ name: 'clarification_request', type: 'text', nullable: true })
  clarificationRequest!: string | null;

  @Column({ name: 'clarification_response', type: 'text', nullable: true })
  clarificationResponse!: string | null;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
