import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus, PaymentStatus } from '../../entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  findAll(status?: string, search?: string) {
    const query = this.projectRepository.createQueryBuilder('project');
    if (status && status !== 'all') {
      const statuses = status.split(',');
      query.where('project.status IN (:...statuses)', { statuses });
    }
    if (search) {
      query.andWhere(
        'project.projectId ILIKE :search OR project.propertyAddress ILIKE :search OR project.applicant ILIKE :search',
        { search: `%${search}%` },
      );
    }
    return query.orderBy('project.createdAt', 'DESC').getMany();
  }

  findOne(id: string) {
    return this.projectRepository.findOne({ where: { id } });
  }

  findByProjectId(projectId: string) {
    return this.projectRepository.findOne({ where: { projectId } });
  }

  findRecent() {
    return this.projectRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });
  }

  async getStats() {
    const total = await this.projectRepository.count();
    const completed = await this.projectRepository.count({ where: { status: ProjectStatus.COMPLETED } });
    // NOTE: ProjectStatus has no 'Rejected' / 'Needs Review' states in this (managers-portal)
    // model. These were carried over from a different status set during the dev merge.
    // Left as 0 until the team decides whether those states belong on Project.
    const rejected = 0;
    const needsReview = 0;
    const inProgress = await this.projectRepository.count({ where: { status: ProjectStatus.IN_PROGRESS } });
    const paymentPending = await this.projectRepository.count({ where: { paymentStatus: PaymentStatus.PENDING } });

    return {
      totalProjects: total,
      approvedProjects: completed,
      rejectedProjects: rejected,
      reviewPending: needsReview,
      inProgress,
      paymentPending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  create(data: Partial<Project>) {
    const project = this.projectRepository.create(data);
    return this.projectRepository.save(project);
  }

  async update(id: string, data: Partial<Project>) {
    await this.projectRepository.update(id, data);
    return this.findOne(id);
  }
}