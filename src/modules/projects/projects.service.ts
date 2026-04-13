import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import {
  Project,
  ProjectStatus,
  PaymentStatus,
} from '../../entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  // Get all projects
  async findAll(
    status?: string,
    paymentStatus?: string,
    search?: string,
    clientId?: string,
  ) {
    const qb = this.projectsRepository.createQueryBuilder('project');

    if (
      status &&
      status !== 'All' &&
      Object.values(ProjectStatus).includes(status as ProjectStatus)
    ) {
      qb.andWhere('project.status = :status', { status });
    }

    if (
      paymentStatus &&
      paymentStatus !== 'All' &&
      Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)
    ) {
      qb.andWhere('project.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (clientId) {
      qb.andWhere('project.clientId = :clientId', { clientId });
    }

    if (search) {
      qb.andWhere(
        '(project.projectId ILIKE :search OR project.propertyAddress ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('project.createdAt', 'DESC');
    return qb.getMany();
  }

  // Get one project WITH documents and team
  async findOne(id: string) {
    return this.projectsRepository.findOne({
      where: { id },
      relations: ['documents', 'teamMembers'],
    });
  }

  // Get recent projects (for dashboard)
  async findRecent(limit: number = 5, clientId?: string) {
    const where: FindOptionsWhere<Project> = {};
    if (clientId) {
      where.clientId = clientId;
    }

    return this.projectsRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
