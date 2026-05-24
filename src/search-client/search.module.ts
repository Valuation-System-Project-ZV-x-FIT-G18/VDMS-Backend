import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { LoanApplicantModule } from '../loan-applicant/loan-applicant.module';
import { Project } from '../entities/project.entity';

@Module({
  imports: [
    LoanApplicantModule, // gives access to LoanApplicantService
    TypeOrmModule.forFeature([Project]), // inject Project repo for latest project lookup
  ],
  controllers: [SearchController], // register the /search endpoint
  providers: [SearchService], // the search business logic
})
export class SearchModule {}
