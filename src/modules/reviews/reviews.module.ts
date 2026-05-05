import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../../entities/review.entity';
import { Project } from '../../entities/project.entity';
import { Manager } from '../../entities/manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Project, Manager])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
