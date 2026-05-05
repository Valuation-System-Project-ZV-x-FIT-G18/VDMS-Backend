import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';

@Controller('approvals')
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @Get()
  findAll() {
    return this.approvalsService.findAll();
  }

  @Get('pending')
  findPending(@Query('managerId') managerId?: string) {
    return this.approvalsService.findPending(managerId);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.approvalsService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.approvalsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.approvalsService.create(body);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body() body: any) {
    return this.approvalsService.approve(id, body.comments, body.managerId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() body: any) {
    return this.approvalsService.reject(id, body.comments, body.managerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.approvalsService.update(id, body);
  }
}