import { Controller, Get, Query } from '@nestjs/common';
import { ProjectSummaryService } from './project-summary.service';

@Controller('project-summary') // handles /project-summary routes
export class ProjectSummaryController {
  constructor(private readonly service: ProjectSummaryService) {}

  @Get() // GET /project-summary?nic=<nic>
  getSummary(@Query('nic') nic: string) {
    return this.service.getSummary(nic); // delegates to service
  }
}
