import { Controller, Get, Query } from '@nestjs/common';
import { AssignedService } from './assigned.service';
import { ProjectIdQueryDto } from '../validate';

@Controller('assigned')
export class AssignedController {
  constructor(private service: AssignedService) {}

  @Get()
  async getAll() {
    return await this.service.findAll();
  }

  @Get('project')
  async getByProject(@Query() query: ProjectIdQueryDto) {
    return await this.service.findByProject(query.projectId);
  }
}
