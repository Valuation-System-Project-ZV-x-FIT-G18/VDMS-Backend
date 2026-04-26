import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'; // TypeORM decorators
import { Bank } from './bank.entity'; // FK to banks table
import { Project } from './project.entity'; // FK to projects table
import { BankOfficer } from './bank-officer.entity'; // FK to bank_officers table

@Entity('bank_project_officer') // junction table linking bank, project, and officer
export class BankProjectOfficer {
  @PrimaryGeneratedColumn() // auto-increment PK
  id!: number;

  @ManyToOne(() => Bank) // which bank is involved
  @JoinColumn({ name: 'bank_id' }) // FK column
  bank!: Bank;

  @ManyToOne(() => Project) // which project this relates to
  @JoinColumn({ name: 'project_id' }) // FK column
  project!: Project;

  @ManyToOne(() => BankOfficer) // which officer is handling this
  @JoinColumn({ name: 'officer_id' }) // FK column
  officer!: BankOfficer;
}
