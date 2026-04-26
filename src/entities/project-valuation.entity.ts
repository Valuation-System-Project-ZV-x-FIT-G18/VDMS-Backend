import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssignedTo } from './assigned-to.entity';
import { Project } from './project.entity';

@Entity('project_valuation')
export class ProjectValuation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  valuation_id!: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @ManyToOne(() => AssignedTo)
  @JoinColumn({ name: 'assigned_to_id' })
  valuation!: AssignedTo;
}
