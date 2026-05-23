import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnicalOfficerProject } from '../entities/technical-officer-project.entity';
import { CreateTechnicalOfficerProjectDto } from './dto/create-technical-officer-project.dto';
import { UpdateTechnicalOfficerProjectDto } from './dto/update-technical-officer-project.dto';

@Injectable()
export class TechnicalOfficerProjectsService {
  constructor(
    @InjectRepository(TechnicalOfficerProject)
    private readonly projectsRepository: Repository<TechnicalOfficerProject>,
  ) {}

  async create(createProjectDto: CreateTechnicalOfficerProjectDto) {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  async findAll() {
    return this.projectsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Technical Officer project ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateTechnicalOfficerProjectDto) {
    const project = await this.findOne(id);
    const updatedProject = this.projectsRepository.merge(
      project,
      updateProjectDto,
    );

    return this.projectsRepository.save(updatedProject);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);

    return {
      message: 'Technical Officer project deleted successfully',
      id,
    };
  }
}
