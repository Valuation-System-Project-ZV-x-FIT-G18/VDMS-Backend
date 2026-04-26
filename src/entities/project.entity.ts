import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; // TypeORM decorators
import { User } from './user.entity'; // FK to users table

@Entity('projects') // maps to "projects" table
export class Project {
  @PrimaryColumn({ length: 6 }) // e.g. pro001 — "pro" + 3-digit number
  project_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ default: 'pending' }) // current project status
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // when created
  created_at: Date;
}
