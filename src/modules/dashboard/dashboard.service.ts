import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Approval } from '../../entities/approval.entity';
import { DraftReport } from '../../entities/draft-reports.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Approval) private approvalRepo: Repository<Approval>,
    @InjectRepository(DraftReport) private draftRepo: Repository<DraftReport>,
  ) {}

  async getStats() {
    const totalProjects = await this.projectRepo.count();
    const approvedProjects = await this.projectRepo.count({ where: { status: 'Completed' } });
    const rejectedProjects = await this.projectRepo.count({ where: { status: 'Rejected' } });
    const reviewPending = await this.projectRepo.count({ where: { status: 'Needs Review' } });
    const pendingApprovals = await this.approvalRepo.count({ where: { status: 'PENDING' } });
    const completionRate = totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0;

    return {
      totalProjects,
      reviewPending,
      approvedProjects,
      rejectedProjects,
      pendingApprovals,
      completionRate,
      totalRevenue: 2450000,
    };
  }

  async getMorningReport() {
    const completedToday = await this.projectRepo.count({ where: { status: 'Completed' } });
    const activeProjects = await this.projectRepo.count({ where: { status: 'In Progress' } });
    const pendingApprovals = await this.approvalRepo.count({ where: { status: 'PENDING' } });

    return {
      date: new Date().toLocaleDateString('en-US'),
      completedProjects: completedToday,
      activeProjects,
      criticalIssues: pendingApprovals > 5 ? 2 : 0,
      meetings: 1,
      insights: [
        'Review pending approvals before noon',
        'Check overdue projects in bottlenecks',
        'Approve finalized reports',
      ],
    };
  }
}