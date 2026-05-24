import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { LegalDetail } from '../entities/legal-detail.entity';
import { User } from '../entities/user.entity'; // to look up user by NIC
import { LegalDetailsDto } from './dto/legal-details.dto';

@Injectable()
export class LegalDetailsService {
  constructor(
    @InjectRepository(LegalDetail)
    private readonly repo: Repository<LegalDetail>,
    @InjectRepository(User) private readonly userRepo: Repository<User>, // inject User repo
  ) {}

  /* Save a new legal detail record with auto-generated ID */
  async save(dto: LegalDetailsDto) {
    const user = await this.userRepo.findOne({ where: { nic: dto.nic } }); // find user by NIC
    if (!user) {
      throw new BadRequestException('No user found for the provided NIC');
    }

    const count = await this.repo.count(); // count existing rows
    const legalId = `leg${String(count + 1).padStart(3, '0')}`; // e.g. leg001

    const usageRegulations = Array.isArray(dto.usageRegulations)
      ? dto.usageRegulations
      : [];

    const data: DeepPartial<LegalDetail> = {
      legal_id: legalId,
      user: user ?? undefined, // link to user (FK)
      deed_number: dto.deedNumber,
      deed_type: dto.deedType,
      registration_date: dto.registrationDate,
      notary_details: dto.notaryDetails,
      ownership_type: dto.ownershipType,
      usage_regulations: usageRegulations,
      file_path: dto.filePath || undefined,
    };

    const record = this.repo.create(data); // build entity instance
    await this.repo.save(record); // persist to database

    return { success: true, legalId }; // return generated ID
  }
}
