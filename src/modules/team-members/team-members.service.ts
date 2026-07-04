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

  findAll() {
    return this.teamMemberRepository.find();
  }

  findByProject(projectId: string) {
    return this.teamMemberRepository.find({ where: { projectId } });
  }

  create(data: Partial<TeamMember>) {
    const member = this.teamMemberRepository.create(data);
    return this.teamMemberRepository.save(member);
  }
}