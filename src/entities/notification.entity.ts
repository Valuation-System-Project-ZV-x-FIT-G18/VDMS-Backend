import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() managerId!: string;
  @Column({ default: 'GENERAL' }) type!: string;
  @Column() message!: string;
  @Column({ default: false }) isRead!: boolean;
  @Column({ nullable: true }) projectId!: string;
  @CreateDateColumn() created_at!: Date;
}