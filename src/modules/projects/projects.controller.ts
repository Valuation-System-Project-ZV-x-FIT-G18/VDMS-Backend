/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // GET /projects
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('search') search?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.projectsService.findAll(status, paymentStatus, search, clientId);
  }

  // GET /projects/recent
  @Get('recent')
  findRecent(@Query('limit') limit?: string, @Query('clientId') clientId?: string) {
    return this.projectsService.findRecent(limit ? parseInt(limit, 10) : 5, clientId);
  }

  // GET /projects/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }
}