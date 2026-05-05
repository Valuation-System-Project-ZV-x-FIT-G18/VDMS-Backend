import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { Approval } from '../../entities/approval.entity';
import { DraftReport } from '../../entities/draft-reports.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Approval, DraftReport])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}