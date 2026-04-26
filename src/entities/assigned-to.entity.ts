import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicalOfficer } from './technical-officer.entity'; // FK to officer

@Entity('assigned_to') // maps to "assigned_to" — valuation assignments
export class AssignedTo {
  @PrimaryGeneratedColumn() // auto-increment PK
  id: number;

  @ManyToOne(() => TechnicalOfficer) // the officer assigned to this valuation
  @JoinColumn({ name: 'to_id' })
  officer: TechnicalOfficer;

  @Column() // FK column for officer ID
  to_id: string;

  @Column({ type: 'timestamp' }) // scheduled date and time for the valuation
  time_date: Date;

  @Column() // project ID this assignment belongs to
  project_id: string;

  @Column({ nullable: true }) // NIC of the loan applicant for this valuation
  loan_applicant_nic: string;

  @Column({ nullable: true }) // address of the property being valued
  property_address: string;
}
