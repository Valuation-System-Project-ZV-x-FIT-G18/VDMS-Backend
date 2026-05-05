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

  create(data: Partial<TeamMember>) {
    const member = this.teamMemberRepository.create(data);
    return this.teamMemberRepository.save(member);
  }
}