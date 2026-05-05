import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('clarifications')
export class Clarification {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() projectId!: string;
  @Column() managerId!: string;
  @Column() recipient!: string;
  @Column({ type: 'text' }) question!: string;
  @Column({ default: 'PENDING' }) status!: string;
  @Column({ nullable: true, type: 'text' }) response!: string;
  @CreateDateColumn() created_at!: Date;
}