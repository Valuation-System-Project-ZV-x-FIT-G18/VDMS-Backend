import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyPlan } from '../entities/survey-plan.entity';
import { User } from '../entities/user.entity'; // needed to look up user by NIC
import { SurveyPlanController } from './survey-plan.controller';
import { SurveyPlanService } from './survey-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyPlan, User])], // register both repos
  controllers: [SurveyPlanController],
  providers: [SurveyPlanService],
})
export class SurveyPlanModule {}
