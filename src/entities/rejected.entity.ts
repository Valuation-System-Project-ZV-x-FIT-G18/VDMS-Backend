import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicalOfficer } from './technical-officer.entity'; // FK to officer

@Entity('rejected') // maps to "rejected" table — rejected valuations
export class Rejected {
  @PrimaryGeneratedColumn() // auto-increment PK
  id: number;

  @ManyToOne(() => TechnicalOfficer) // the officer linked to rejection
  @JoinColumn({ name: 'to_id' })
  officer: TechnicalOfficer;

  @Column() // FK column for officer ID
  to_id: string;

  @Column() // why the valuation was rejected
  reason_for_reject: string;
}
