import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from '../../entities/approval.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private approvalRepository: Repository<Approval>,
  ) {}

  findAll() {
    return this.approvalRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.approvalRepository.findOne({ where: { id } });
  }

  findPending(managerId?: string) {
    const where: any = { status: 'PENDING' };
    if (managerId) where.managerId = managerId;
    return this.approvalRepository.find({ where, order: { created_at: 'DESC' } });
  }

  findByProject(projectId: string) {
    return this.approvalRepository.find({ where: { projectId } });
  }

  create(data: Partial<Approval>) {
    const approval = this.approvalRepository.create(data);
    return this.approvalRepository.save(approval);
  }

  async approve(id: string, comments: string, managerId: string) {
    await this.approvalRepository.update(id, {
      status: 'APPROVED',
      comments,
      processedAt: new Date(),
    });
    return this.findOne(id);
  }

  async reject(id: string, comments: string, managerId: string) {
    await this.approvalRepository.update(id, {
      status: 'REJECTED',
      comments,
      processedAt: new Date(),
    });
    return this.findOne(id);
  }

  async update(id: string, data: Partial<Approval>) {
    await this.approvalRepository.update(id, data);
    return this.findOne(id);
  }
}