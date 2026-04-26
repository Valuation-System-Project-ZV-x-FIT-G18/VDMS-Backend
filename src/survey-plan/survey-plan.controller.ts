import { Controller, Post, Body } from '@nestjs/common'; // NestJS decorators
import { SurveyPlanService } from './survey-plan.service';
import { SurveyPlanDto } from './dto/survey-plan.dto';

@Controller('survey-plan') // POST /survey-plan
export class SurveyPlanController {
  constructor(private readonly service: SurveyPlanService) {}

  @Post()
  save(@Body() dto: SurveyPlanDto) {
    return this.service.save(dto); // delegate to service
  }
}
