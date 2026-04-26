import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignedTo } from '../entities/assigned-to.entity';
import { ProjectValuation } from '../entities/project-valuation.entity';

@Injectable()
export class AssignedService {
  constructor(
    @InjectRepository(AssignedTo) private repo: Repository<AssignedTo>,
    @InjectRepository(ProjectValuation)
    private valuationRepo: Repository<ProjectValuation>,
  ) {}

  private async attachValuationIds(rows: AssignedTo[]) {
    if (!rows.length) return rows;

    const assignmentIds = rows.map((row) => row.id);
    const valuationRows = await this.valuationRepo
      .createQueryBuilder('pv')
      .select(['pv.assigned_to_id AS assigned_to_id', 'pv.valuation_id AS valuation_id'])
      .where('pv.assigned_to_id IN (:...assignmentIds)', { assignmentIds })
      .getRawMany<{ assigned_to_id: number; valuation_id: number }>();

    const valuationMap = new Map<number, number>();
    for (const row of valuationRows) {
      valuationMap.set(Number(row.assigned_to_id), Number(row.valuation_id));
    }

    return rows.map((row) => ({
      ...row,
      valuation_id: valuationMap.get(row.id) ?? null,
    }));
  }

  // Get all assigned officers with their details
  async findAll() {
    const rows = await this.repo.find({
      relations: ['officer'],
      order: { time_date: 'DESC' },
    });

    return this.attachValuationIds(rows);
  }

  // Get assigned officers for a specific project
  async findByProject(projectId: string) {
    const rows = await this.repo.find({
      where: { project_id: projectId },
      relations: ['officer'],
      order: { time_date: 'DESC' },
    });

    return this.attachValuationIds(rows);
  }
}
