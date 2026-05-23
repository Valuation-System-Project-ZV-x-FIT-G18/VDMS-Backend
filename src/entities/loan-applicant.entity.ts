import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm'; // TypeORM decorators
import { User } from './user.entity'; // references the User table

@Entity('loan_applicants') // maps to "loan_applicants" table
export class LoanApplicant {
  @PrimaryColumn({ length: 6 }) // e.g. loa001 — "loa" + 3-digit number
  loan_applicant_id: string;

  @OneToOne(() => User) // each loan applicant is ONE user
  @JoinColumn({ name: 'user_id' }) // FK column in this table
  user: User;
}
