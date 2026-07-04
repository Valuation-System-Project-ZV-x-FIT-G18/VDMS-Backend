import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datasheet } from '../../entities/datasheet.entity';
import { DatasheetsController } from './datasheets.controller';
import { DatasheetsService } from './datasheets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Datasheet])],
  controllers: [DatasheetsController],
  providers: [DatasheetsService],
  exports: [DatasheetsService],
})
export class DatasheetsModule {}
