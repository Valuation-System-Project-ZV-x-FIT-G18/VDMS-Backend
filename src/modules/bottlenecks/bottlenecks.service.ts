import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bottleneck } from '../../entities/bottleneck.entity';

@Injectable()
export class BottlenecksService {
  constructor(
    @InjectRepository(Bottleneck)
    private bottleneckRepository: Repository<Bottleneck>,
  ) {}

  findAll() {
    return this.bottleneckRepository.find({ order: { dayStuck: 'DESC' } });
  }

  async getStats() {
    const all = await this.bottleneckRepository.find();
    return {
      overdue: all.filter(b => b.issueType === 'Overdue').length,
      missingDocs: all.filter(b => b.issueType === 'Missing Docs').length,
      stuckApprovals: all.filter(b => b.issueType === 'Stuck Approval').length,
      paymentOverdue: all.filter(b => b.issueType === 'Payment Overdue').length,
    };
  }

  create(data: Partial<Bottleneck>) {
    const bottleneck = this.bottleneckRepository.create(data);
    return this.bottleneckRepository.save(bottleneck);
  }

  findOne(id: string) {
    return this.bottleneckRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Bottleneck>) {
    await this.bottleneckRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.bottleneckRepository.delete(id);
  }
}