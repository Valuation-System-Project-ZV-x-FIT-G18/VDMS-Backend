import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) // inject the Project repository
    private readonly projectRepo: Repository<Project>,
  ) {}

  /* Find a project by its ID (e.g. "pro001") */
  findById(projectId: string): Promise<Project | null> {
    return this.projectRepo.findOne({ where: { id: projectId } });
  }
}
