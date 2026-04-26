import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreeOfficer } from '../entities/free-officer.entity';

@Injectable()
export class AvailableToService {
  constructor(
    @InjectRepository(FreeOfficer)
    private readonly repo: Repository<FreeOfficer>,
  ) {}

  /* Return only currently free officers with officer details */
  async findAll() {
    const rows = await this.repo.find({
      relations: ['officer'],
      order: { id: 'DESC' },
    });

    return rows.filter((r) => !!r.officer);
  }
}
