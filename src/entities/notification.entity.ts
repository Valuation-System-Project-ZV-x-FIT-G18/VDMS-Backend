import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

export enum NotificationType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export enum NotificationEvent {
  PROJECT_CREATED = 'PROJECT_CREATED',
  DOCUMENT_MISSING = 'DOCUMENT_MISSING',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  REPORT_PREPARED = 'REPORT_PREPARED',
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',
  PAYMENT_DUE = 'PAYMENT_DUE',
  STAGE_CHANGED = 'STAGE_CHANGED',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type!: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationEvent,
  })
  event!: NotificationEvent;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  message!: string;

  @Column({ name: 'recipient_id' })
  recipientId!: string;

  @Column({ name: 'recipient_role' })
  recipientRole!: string;

  @Column({ name: 'project_id', nullable: true })
  projectId!: string;

  @Column({ name: 'is_read', default: false })
  isRead!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Project, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project!: Project;
}
