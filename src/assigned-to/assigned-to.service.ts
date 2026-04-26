import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignedTo } from '../entities/assigned-to.entity'; // assigned_to table entity

@Injectable()
export class AssignedToService {
  constructor(
    @InjectRepository(AssignedTo) private readonly repo: Repository<AssignedTo>,
  ) {}

  /* Return all assigned officers with their full details */
  findAll() {
    return this.repo.find({ relations: ['officer'] }); // eager-load TechnicalOfficer FK
  }
}
