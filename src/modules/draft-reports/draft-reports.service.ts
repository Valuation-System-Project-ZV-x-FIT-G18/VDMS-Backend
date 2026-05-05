import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DraftReport } from '../../entities/draft-reports.entity';

@Injectable()
export class DraftReportsService {
  constructor(
    @InjectRepository(DraftReport)
    private draftRepository: Repository<DraftReport>,
  ) {}

  findAll(status?: string) {
    if (status) return this.draftRepository.find({ where: { status } });
    return this.draftRepository.find({ order: { created_at: 'DESC' } });
  }

  findOne(id: string) {
    return this.draftRepository.findOne({ where: { id } });
  }

  findByProjectId(projectId: string) {
    return this.draftRepository.find({
      where: { projectId },
      order: { version: 'DESC' },
    });
  }

  findVersionHistory(projectId: string) {
    return this.draftRepository.find({
      where: { projectId },
      order: { version: 'ASC' },
    });
  }

  create(data: Partial<DraftReport>) {
    const draft = this.draftRepository.create(data);
    return this.draftRepository.save(draft);
  }

  async update(id: string, data: Partial<DraftReport>) {
    await this.draftRepository.update(id, data);
    return this.findOne(id);
  }

  async approveL3(id: string, managerId: string, comments: string) {
    await this.draftRepository.update(id, {
      status: 'APPROVED_L3',
      approvedByL3: managerId,
      feedback: comments,
    });
    return this.findOne(id);
  }

  async approveL2(id: string, managerId: string, comments: string) {
    await this.draftRepository.update(id, {
      status: 'APPROVED_L2',
      approvedByL2: managerId,
      feedback: comments,
    });
    return this.findOne(id);
  }

  async approveL1(id: string, managerId: string, comments: string) {
    await this.draftRepository.update(id, {
      status: 'APPROVED_L1',
      approvedByL1: managerId,
      feedback: comments,
    });
    return this.findOne(id);
  }

  async lock(id: string) {
    await this.draftRepository.update(id, {
      status: 'LOCKED',
      isLocked: true,
    });
    return this.findOne(id);
  }

  async reject(id: string, reason: string, feedback: string) {
    await this.draftRepository.update(id, {
      status: 'REJECTED',
      rejectionReason: reason,
      feedback,
    });
    return this.findOne(id);
  }

  remove(id: string) {
    return this.draftRepository.delete(id);
  }
}