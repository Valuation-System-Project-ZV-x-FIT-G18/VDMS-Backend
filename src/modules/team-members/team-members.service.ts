import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from '../../entities/team-member.entity';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  // Get all team members for a project
  async findByProject(projectId: string): Promise<TeamMember[]> {
    return this.teamMemberRepository.find({
      where: { projectId },
    });
  }
}
