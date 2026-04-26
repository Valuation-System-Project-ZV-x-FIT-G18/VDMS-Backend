import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignedTo } from '../entities/assigned-to.entity';
import { TechnicalOfficer } from '../entities/technical-officer.entity';
import { AssignedService } from './assigned.service';
import { AssignedController } from './assigned.controller';
import { FleetService } from './fleet.service';
import { FleetController } from './fleet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssignedTo, TechnicalOfficer])],
  providers: [AssignedService, FleetService],
  controllers: [AssignedController, FleetController],
  exports: [AssignedService, FleetService],
})
export class AssignedModule {}
