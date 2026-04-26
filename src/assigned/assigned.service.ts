import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignedTo } from '../entities/assigned-to.entity';

@Injectable()
export class AssignedService {
  constructor(
    @InjectRepository(AssignedTo) private repo: Repository<AssignedTo>,
  ) {}

  // Get all assigned officers with their details
  async findAll() {
    return this.repo.find({
      relations: ['officer'],
      order: { time_date: 'DESC' },
    });
  }

  // Get assigned officers for a specific project
  async findByProject(projectId: string) {
    return this.repo.find({
      where: { project_id: projectId },
      relations: ['officer'],
      order: { time_date: 'DESC' },
    });
  }
}
