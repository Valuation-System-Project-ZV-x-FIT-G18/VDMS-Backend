import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnLeave } from '../entities/on-leave.entity'; // on_leave table entity

@Injectable()
export class OnLeaveToService {
  constructor(
    @InjectRepository(OnLeave) private readonly repo: Repository<OnLeave>,
  ) {}

  /* Return all on-leave officers with their details and leave dates */
  findAll() {
    return this.repo.find({ relations: ['officer'] }); // eager-load TechnicalOfficer FK
  }
}
