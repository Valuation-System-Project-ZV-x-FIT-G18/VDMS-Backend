import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeOfficer } from '../entities/free-officer.entity';
import { AvailableToController } from './available-to.controller';
import { AvailableToService } from './available-to.service';

@Module({
  imports: [TypeOrmModule.forFeature([FreeOfficer])],
  controllers: [AvailableToController],
  providers: [AvailableToService],
})
export class AvailableToModule {}
