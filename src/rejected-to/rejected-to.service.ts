import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rejected } from '../entities/rejected.entity'; // rejected table entity
import { FreeOfficer } from '../entities/free-officer.entity'; // free table for OK action
import { DeepPartial } from 'typeorm';

@Injectable()
export class RejectedToService {
  constructor(
    @InjectRepository(Rejected) private readonly rejRepo: Repository<Rejected>,
    @InjectRepository(FreeOfficer)
    private readonly freeRepo: Repository<FreeOfficer>,
  ) {}

  /* Return all rejected officers with their details */
  findAll() {
    return this.rejRepo.find({ relations: ['officer'] }); // eager-load TechnicalOfficer
  }

  /* OK = accept officer back — move from rejected → free table */
  async acceptBack(id: number) {
    const row = await this.rejRepo.findOneByOrFail({ id }); // find the rejected row
    const data: DeepPartial<FreeOfficer> = { to_id: row.to_id }; // prepare free entry
    await this.freeRepo.save(this.freeRepo.create(data)); // insert into free table
    await this.rejRepo.delete(id); // remove from rejected
    return { success: true };
  }

  /* Decline = permanently remove from rejected table */
  async decline(id: number) {
    await this.rejRepo.delete(id); // just delete the row
    return { success: true };
  }
}
