import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('draft_reports')
export class DraftReport {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() projectId!: string;
  @Column({ nullable: true }) managerId!: string;
  @Column() title!: string;
  @Column({ nullable: true, type: 'text' }) content!: string;
  @Column({ default: 'DRAFT' }) status!: string;
  @Column({ default: 1 }) version!: number;
  @Column({ nullable: true }) propertyAddress!: string;
  @Column({ nullable: true }) clientName!: string;
  @Column({ nullable: true }) assignedAppraiser!: string;
  @Column({ nullable: true }) lotNo!: string;
  @Column({ nullable: true }) planNo!: string;
  @Column({ nullable: true, type: 'text' }) landDescription!: string;
  @Column({ nullable: true, type: 'decimal' }) estimatedValue!: number;
  @Column({ nullable: true }) currency!: string;
  @Column({ nullable: true, type: 'text' }) feedback!: string;
  @Column({ nullable: true }) rejectionReason!: string;
  @Column({ nullable: true }) approvedByL3!: string;
  @Column({ nullable: true }) approvedByL2!: string;
  @Column({ nullable: true }) approvedByL1!: string;
  @Column({ default: false }) isLocked!: boolean;
  @Column({ default: false }) aiAssisted!: boolean;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}