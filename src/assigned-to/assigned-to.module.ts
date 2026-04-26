import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignedTo } from '../entities/assigned-to.entity';
import { AssignedToController } from './assigned-to.controller';
import { AssignedToService } from './assigned-to.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssignedTo])], // register assigned_to repo
  controllers: [AssignedToController],
  providers: [AssignedToService],
})
export class AssignedToModule {}
