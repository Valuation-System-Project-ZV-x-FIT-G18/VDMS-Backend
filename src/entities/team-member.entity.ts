import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

export enum TeamRole {
  COORDINATOR = 'coordinator',
  TECHNICAL_OFFICER = 'Technical officer',
  MANAGER = 'Manager',
  SENIOR_VALUATOR = 'Senior Valuator',
  VALUATOR = 'Valuator',
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: TeamRole,
  })
  role!: TeamRole;

  @Column()
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ name: 'project_id' })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;
}
