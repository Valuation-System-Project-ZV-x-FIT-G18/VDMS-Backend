import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftReport } from '../../entities/draft-reports.entity';
import { DraftReportsService } from './draft-reports.service';
import { DraftReportsController } from './draft-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DraftReport])],
  providers: [DraftReportsService],
  controllers: [DraftReportsController],
  exports: [DraftReportsService],
})
export class DraftReportsModule {}