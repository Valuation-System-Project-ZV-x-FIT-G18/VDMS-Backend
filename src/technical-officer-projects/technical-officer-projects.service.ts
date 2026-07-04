import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnicalOfficerProject } from '../entities/technical-officer-project.entity';
import { CreateTechnicalOfficerProjectDto } from './dto/create-technical-officer-project.dto';
import { UpdateTechnicalOfficerProjectDto } from './dto/update-technical-officer-project.dto';

// Contains project business logic and database access through TypeORM.
@Injectable()
export class TechnicalOfficerProjectsService {
  constructor(
    @InjectRepository(TechnicalOfficerProject)
    private readonly projectsRepository: Repository<TechnicalOfficerProject>,
  ) {}

  // Creates and saves a new Technical Officer project record.
  async create(createProjectDto: CreateTechnicalOfficerProjectDto) {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  // Reads all projects, newest first.
  async findAll() {
    return this.projectsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Finds one project or throws 404 if the id does not exist.
  async findOne(id: string) {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Technical Officer project ${id} not found`);
    }

    return project;
  }

  // Loads the existing project, merges allowed changes, then saves it.
  async update(id: string, updateProjectDto: UpdateTechnicalOfficerProjectDto) {
    const project = await this.findOne(id);
    const updatedProject = this.projectsRepository.merge(
      project,
      updateProjectDto,
    );

    return this.projectsRepository.save(updatedProject);
  }

  // Deletes a project after confirming it exists.
  async remove(id: string) {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);

    return {
      message: 'Technical Officer project deleted successfully',
      id,
    };
  }
}
