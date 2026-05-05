import { Controller, Get, Post, Body } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';

@Controller('team-members')
export class TeamMembersController {
  constructor(private teamMembersService: TeamMembersService) {}

  @Get()
  findAll() {
    return this.teamMembersService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.teamMembersService.create(body);
  }
}