import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnLeave } from '../entities/on-leave.entity';
import { OnLeaveToController } from './on-leave-to.controller';
import { OnLeaveToService } from './on-leave-to.service';

@Module({
  imports: [TypeOrmModule.forFeature([OnLeave])], // register on_leave repo
  controllers: [OnLeaveToController],
  providers: [OnLeaveToService],
})
export class OnLeaveToModule {}
