import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { LoanApplicantService } from './loan-applicant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanApplicant, ProjectLoanApplicant]), // both tables
  ],
  providers: [LoanApplicantService],
  exports: [LoanApplicantService],
})
export class LoanApplicantModule {}
