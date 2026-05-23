import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalDetail } from '../entities/legal-detail.entity';
import { User } from '../entities/user.entity'; // needed for user lookup
import { LegalDetailsController } from './legal-details.controller';
import { LegalDetailsService } from './legal-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([LegalDetail, User])], // register both repos
  controllers: [LegalDetailsController],
  providers: [LegalDetailsService],
})
export class LegalDetailsModule {}
