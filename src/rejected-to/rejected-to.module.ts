import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rejected } from '../entities/rejected.entity';
import { FreeOfficer } from '../entities/free-officer.entity';
import { RejectedToController } from './rejected-to.controller';
import { RejectedToService } from './rejected-to.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rejected, FreeOfficer])], // both repos needed
  controllers: [RejectedToController],
  providers: [RejectedToService],
})
export class RejectedToModule {}
