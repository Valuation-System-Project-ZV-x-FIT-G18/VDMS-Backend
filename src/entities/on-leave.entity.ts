import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicalOfficer } from './technical-officer.entity'; // FK reference

@Entity('on_leave') // maps to "on_leave" table — tracks officer leaves
export class OnLeave {
  @PrimaryGeneratedColumn() // auto-increment primary key
  id: number;

  @ManyToOne(() => TechnicalOfficer) // links to the officer taking leave
  @JoinColumn({ name: 'to_id' })
  officer: TechnicalOfficer;

  @Column() // FK column for officer ID
  to_id: string;

  @Column() // why the officer is on leave
  reason_for_leave: string;

  @Column({ type: 'date' }) // leave start date
  date_from: string;

  @Column({ type: 'date' }) // leave end date
  date_to: string;
}
