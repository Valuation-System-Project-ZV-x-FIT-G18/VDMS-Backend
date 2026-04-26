import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'; // TypeORM decorators
import { LoanApplicant } from './loan-applicant.entity'; // FK to loan applicant
import { Project } from './project.entity'; // FK to project

@Entity('project_loan_applicant') // junction table name
export class ProjectLoanApplicant {
  @PrimaryGeneratedColumn() // auto-increment PK
  id: number;

  @OneToOne(() => Project) // one project per row
  @JoinColumn({ name: 'project_id' }) // FK column
  project: Project;

  @OneToOne(() => LoanApplicant) // one loan applicant per row
  @JoinColumn({ name: 'loan_applicant_id' }) // FK column
  loan_applicant: LoanApplicant;
}
