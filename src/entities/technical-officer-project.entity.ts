import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TechnicalOfficerProjectStatus {
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  SITE_INSPECTION = 'Site Inspection',
  DOCUMENT_UPLOAD = 'Document Upload',
  OCR_REVIEW = 'OCR Review',
  REPORT_SUBMISSION = 'Report Submission',
  PENDING_REVIEW = 'Pending Review',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue',
}

@Entity('technical_officer_projects')
export class TechnicalOfficerProject {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_code', unique: true })
  projectCode!: string;

  @Column({ name: 'client_name' })
  clientName!: string;

  @Column()
  location!: string;

  @Column({ type: 'date' })
  deadline!: string;

  @Column({
    type: 'enum',
    enum: TechnicalOfficerProjectStatus,
    default: TechnicalOfficerProjectStatus.ASSIGNED,
  })
  status!: TechnicalOfficerProjectStatus;

  @Column({ type: 'int', default: 0 })
  progress!: number;

  @Column({ name: 'assigned_officer_name' })
  assignedOfficerName!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
