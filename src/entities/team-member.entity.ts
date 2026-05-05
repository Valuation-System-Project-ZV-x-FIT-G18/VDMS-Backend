import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TeamRole { 
  TECHNICAL_OFFICER = 'Technical Officer',
  COORDINATOR = 'Coordinator',
  APPRAISAL_OFFICER = 'Appraisal Officer',
  TEAM_LEADER = 'Team Leader'
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column() role!: string;
  @Column({ default: 0 }) activeProjects!: number;
  @Column({ default: 0 }) completedProjects!: number;
  @Column({ default: 'Medium' }) workload!: string;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}