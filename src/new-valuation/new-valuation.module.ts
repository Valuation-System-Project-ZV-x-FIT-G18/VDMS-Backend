import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignedTo } from '../entities/assigned-to.entity';
import { FreeOfficer } from '../entities/free-officer.entity';
import { TechnicalOfficer } from '../entities/technical-officer.entity';
import { User } from '../entities/user.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { Project } from '../entities/project.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { ProjectValuation } from '../entities/project-valuation.entity';
import { Property } from '../entities/property.entity';
import { NewValuationController } from './new-valuation.controller';
import { NewValuationService } from './new-valuation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TechnicalOfficer,
      FreeOfficer,
      AssignedTo,
      User,
      LoanApplicant,
      Project,
      ProjectLoanApplicant,
      ProjectValuation,
      Property,
    ]),
  ],
  controllers: [NewValuationController],
  providers: [NewValuationService],
})
export class NewValuationModule {}
