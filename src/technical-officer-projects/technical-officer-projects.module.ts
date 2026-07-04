import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalOfficerProject } from '../entities/technical-officer-project.entity';
import { TechnicalOfficerProjectsController } from './technical-officer-projects.controller';
import { TechnicalOfficerProjectsService } from './technical-officer-projects.service';

// Registers the project entity, controller, and service for this feature.
@Module({
  imports: [TypeOrmModule.forFeature([TechnicalOfficerProject])],
  controllers: [TechnicalOfficerProjectsController],
  providers: [TechnicalOfficerProjectsService],
  exports: [TechnicalOfficerProjectsService],
})
export class TechnicalOfficerProjectsModule {}
