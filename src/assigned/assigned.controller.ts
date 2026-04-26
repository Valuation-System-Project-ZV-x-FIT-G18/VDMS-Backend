import { Controller, Get, Query } from '@nestjs/common';
import { AssignedService } from './assigned.service';

@Controller('assigned')
export class AssignedController {
  constructor(private service: AssignedService) {}

  @Get()
  async getAll() {
    return await this.service.findAll();
  }

  @Get('project')
  async getByProject(@Query('projectId') projectId: string) {
    return await this.service.findByProject(projectId);
  }
}
