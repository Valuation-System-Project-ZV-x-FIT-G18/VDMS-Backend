import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

export enum DocumentStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status!: DocumentStatus;

  @Column({ name: 'file_url', type: 'varchar', nullable: true })
  fileUrl!: string | null; // Path to uploaded file

  @Column({ name: 'uploaded_by', type: 'varchar', nullable: true })
  uploadedBy!: string | null; // User who uploaded

  @Column({ default: false })
  required!: boolean;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ name: 'project_id' })
  projectId!: string;

  @CreateDateColumn({ name: 'upload_date' })
  uploadDate!: Date;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;
}
