import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Bank } from '../entities/bank.entity';
import { BankOfficer } from '../entities/bank-officer.entity';
import { BankProjectOfficer } from '../entities/bank-project-officer.entity'; // junction table
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { Project } from '../entities/project.entity'; // needed for junction FK
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { RegisterBankController } from './register-bank.controller';
import { RegisterBankService } from './register-bank.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Bank,
      BankOfficer,
      BankProjectOfficer,
      LoanApplicant,
      Project,
      ProjectLoanApplicant,
    ]),
  ],
  controllers: [RegisterBankController],
  providers: [RegisterBankService],
})
export class RegisterBankModule {}
