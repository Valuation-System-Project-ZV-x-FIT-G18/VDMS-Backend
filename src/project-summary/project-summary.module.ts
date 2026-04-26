import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectSummaryController } from './project-summary.controller';
import { ProjectSummaryService } from './project-summary.service';
import { User } from '../entities/user.entity'; // all entities needed
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { BankOfficer } from '../entities/bank-officer.entity';
import { Property } from '../entities/property.entity';
import { SurveyPlan } from '../entities/survey-plan.entity';
import { LegalDetail } from '../entities/legal-detail.entity';
import { DocumentUpload } from '../entities/document-upload.entity';
import { BankProjectOfficer } from '../entities/bank-project-officer.entity';
import { Project } from '../entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // register repos for injection
      User,
      LoanApplicant,
      ProjectLoanApplicant,
      BankOfficer,
      BankProjectOfficer,
      Project,
      Property,
      SurveyPlan,
      LegalDetail,
      DocumentUpload,
    ]),
  ],
  controllers: [ProjectSummaryController],
  providers: [ProjectSummaryService],
})
export class ProjectSummaryModule {}
