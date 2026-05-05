import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bottleneck } from '../../entities/bottleneck.entity';
import { BottlenecksService } from './bottlenecks.service';
import { BottlenecksController } from './bottlenecks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bottleneck])],
  providers: [BottlenecksService],
  controllers: [BottlenecksController],
  exports: [BottlenecksService],
})
export class BottlenecksModule {}