import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicalOfficer } from './technical-officer.entity'; // FK to officer

@Entity('free') // maps to "free" table — available officers
export class FreeOfficer {
  @PrimaryGeneratedColumn() // auto-increment PK
  id: number;

  @ManyToOne(() => TechnicalOfficer) // the officer who is currently free/available
  @JoinColumn({ name: 'to_id' })
  officer: TechnicalOfficer;

  @Column() // FK column for officer ID
  to_id: string;
}
