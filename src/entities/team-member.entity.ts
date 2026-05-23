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
  LEGACY_COORDINATOR = 'Coordinator',
  TECHNICAL_OFFICER = 'technical-officer',
  LEGACY_TECHNICAL_OFFICER = 'Technical officer',
  LEGACY_MANAGER = 'Manager',
  LEGACY_SENIOR_VALUATOR = 'Senior Valuator',
  L1_MANAGER = 'l1-manager',
  LEGACY_L1_MANAGER = 'L1 Manager',
  L2_MANAGER = 'l2-manager',
  LEGACY_L2_MANAGER = 'L2 Manager',
  L3_MANAGER = 'l3-manager',
  LEGACY_L3_MANAGER = 'L3 Manager',
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
