import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; // TypeORM decorators
import { User } from './user.entity'; // FK to users table

@Entity('legal_details') // maps to "legal_details" table
export class LegalDetail {
  @PrimaryColumn({ length: 6 }) // e.g. leg001
  legal_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column() // official deed number
  deed_number: string;

  @Column() // e.g. Transfer, Gift, Lease
  deed_type: string;

  @Column({ type: 'date' }) // date the deed was registered
  registration_date: string;

  @Column() // notary name & details
  notary_details: string;

  @Column() // Single Owner | Joint Ownership
  ownership_type: string;

  @Column({ type: 'simple-array', nullable: true }) // e.g. ["Environmental","Building"]
  usage_regulations: string[];

  @Column({ nullable: true }) // file path for uploaded deed copy
  file_path: string;
}
