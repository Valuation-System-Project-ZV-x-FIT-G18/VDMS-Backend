import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; // TypeORM decorators
import { User } from './user.entity'; // FK to user

@Entity('bank_officers') // maps to "bank_officers" table
export class BankOfficer {
  @PrimaryColumn({ length: 6 }) // e.g. bof001
  officer_id: string;

  @ManyToOne(() => User) // each officer is linked to a user record
  @JoinColumn({ name: 'user_id' }) // FK column pointing to users table
  user: User;

  @Column({ nullable: true }) // e.g. "Branch Manager"
  designation: string;
}
