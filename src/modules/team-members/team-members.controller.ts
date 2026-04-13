import { Controller, Get, Query } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  // GET /team-members?projectId=xxx
  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.teamMembersService.findByProject(projectId);
  }
}
