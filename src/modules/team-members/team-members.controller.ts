import { Controller, Get, Query } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { ProjectIdQueryDto } from '../../validate';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  // GET /team-members?projectId=xxx
  @Get()
  findByProject(@Query() query: ProjectIdQueryDto) {
    return this.teamMembersService.findByProject(query.projectId);
  }
}
