import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationEvent {
  PROJECT_CREATED = 'project_created',
  DOCUMENT_MISSING = 'document_missing',
  STAGE_CHANGED = 'stage_changed',
  REPORT_PREPARED = 'report_prepared',
  PAYMENT_DUE = 'payment_due',
  PROJECT_COMPLETED = 'project_completed',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.INFO })
  type!: NotificationType;

  @Column({ type: 'enum', enum: NotificationEvent })
  event!: NotificationEvent;

  @Column() title!: string;

  @Column() message!: string;

  @Column({ name: 'recipient_id' }) recipientId!: string;

  @Column({ name: 'recipient_role', nullable: true }) recipientRole!: string;

  @Column({ name: 'project_id', nullable: true }) projectId!: string;

  @Column({ name: 'is_read', default: false }) isRead!: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
