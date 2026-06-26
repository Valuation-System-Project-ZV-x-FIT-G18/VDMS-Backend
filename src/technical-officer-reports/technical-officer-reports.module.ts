import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalOfficerProject } from '../entities/technical-officer-project.entity';
import { TechnicalOfficerReport } from '../entities/technical-officer-report.entity';
import { TechnicalOfficerReportsController } from './technical-officer-reports.controller';
import { TechnicalOfficerReportsService } from './technical-officer-reports.service';

// Registers report and project repositories because reports belong to projects.
@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicalOfficerReport, TechnicalOfficerProject]),
  ],
  controllers: [TechnicalOfficerReportsController],
  providers: [TechnicalOfficerReportsService],
  exports: [TechnicalOfficerReportsService],
})
export class TechnicalOfficerReportsModule {}
