import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnicalOfficer } from '../entities/technical-officer.entity';

@Injectable()
export class FleetService {
  constructor(
    @InjectRepository(TechnicalOfficer) private repo: Repository<TechnicalOfficer>,
  ) {}

  // Get all technical officers
  async getAllOfficers() {
    return this.repo.find({ order: { to_id: 'ASC' } });
  }

  // Count statistics
  async getFleetStats() {
    const total = await this.repo.count();
    return { total, message: 'Fleet statistics loaded' };
  }
}
