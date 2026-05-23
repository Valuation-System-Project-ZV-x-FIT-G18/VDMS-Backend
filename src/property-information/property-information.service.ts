import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity'; // to look up user by NIC
import { PropertyInformationDto } from './dto/property-information.dto';

@Injectable()
export class PropertyInformationService {
  constructor(
    @InjectRepository(Property) private readonly repo: Repository<Property>,
    @InjectRepository(User) private readonly userRepo: Repository<User>, // inject User repo
  ) {}

  /* Save a new property record with auto-generated ID */
  async save(dto: PropertyInformationDto) {
    const user = await this.userRepo.findOne({ where: { nic: dto.nic } }); // find user by NIC
    const count = await this.repo.count(); // count existing rows
    const propertyId = `prp${String(count + 1).padStart(3, '0')}`; // e.g. prp001

    const data: DeepPartial<Property> = {
      property_id: propertyId,
      user: user ?? undefined, // link to user (FK)
      address: dto.address,
      city: dto.city,
      district: dto.district,
      province: dto.province,
      local_authority: dto.localAuthority,
      land_type: dto.landType,
      latitude: dto.latitude ? parseFloat(dto.latitude) : undefined,
      longitude: dto.longitude ? parseFloat(dto.longitude) : undefined,
    };

    const property = this.repo.create(data); // build entity instance
    await this.repo.save(property); // persist to database

    return { success: true, propertyId }; // return generated ID
  }
}
