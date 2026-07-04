import { Entity, PrimaryColumn, Column } from 'typeorm'; // TypeORM decorators for table mapping

// Maps this class to the technical_officers database table.
@Entity('technical_officers') // maps to "technical_officers" table in DB
export class TechnicalOfficer {
  @PrimaryColumn({ length: 6 }) // e.g. tof001 — unique officer ID
  to_id: string;

  @Column() // full name of the officer
  name: string;

  @Column() // first name only
  first_name: string;

  @Column() // last name / surname
  last_name: string;

  @Column() // name with initials format e.g. "R.A. Silva"
  name_with_initials: string;

  @Column({ unique: true }) // email must be unique per officer
  email: string;

  @Column() // contact phone number
  phone: string;

  @Column({ unique: true }) // national identity card — unique
  nic: string;

  @Column({ nullable: true }) // officer's current city
  city?: string;

  @Column({ type: 'date' }) // date of birth stored as date type
  dob: string;
}
