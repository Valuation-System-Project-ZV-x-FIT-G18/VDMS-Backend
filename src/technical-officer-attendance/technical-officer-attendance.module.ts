import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalOfficerAttendance } from '../entities/technical-officer-attendance.entity';
import { TechnicalOfficerAttendanceController } from './technical-officer-attendance.controller';
import { TechnicalOfficerAttendanceService } from './technical-officer-attendance.service';

// Registers the attendance entity, controller, and service for this feature.
@Module({
  imports: [TypeOrmModule.forFeature([TechnicalOfficerAttendance])],
  controllers: [TechnicalOfficerAttendanceController],
  providers: [TechnicalOfficerAttendanceService],
  exports: [TechnicalOfficerAttendanceService],
})
export class TechnicalOfficerAttendanceModule {}
