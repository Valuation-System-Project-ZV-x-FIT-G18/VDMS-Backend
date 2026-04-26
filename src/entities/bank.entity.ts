import { Entity, PrimaryColumn, Column } from 'typeorm'; // TypeORM decorators

@Entity('banks') // maps to "banks" table
export class Bank {
  @PrimaryColumn({ length: 6 }) // e.g. bnk001
  bank_id: string;

  @Column() // e.g. "Bank of Ceylon"
  bank_name: string;

  @Column() // e.g. "Colombo Fort"
  branch: string;

  @Column() // e.g. "7010"
  branch_code: string;
}
