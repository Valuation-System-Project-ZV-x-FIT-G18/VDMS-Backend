import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Manager } from '../../entities/manager.entity';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
  ) {}

  findAll(role?: string) {
    if (role) return this.managerRepository.find({ where: { role: role as any } });
    return this.managerRepository.find();
  }

  findOne(id: string) {
    return this.managerRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Manager>) {
    const password = data.password || '';
    const hashed = await bcrypt.hash(password, 10);
    const manager = this.managerRepository.create({ ...data, password: hashed } as DeepPartial<Manager>);
    return this.managerRepository.save(manager);
  }

  async update(id: string, data: Partial<Manager>) {
    await this.managerRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.managerRepository.update(id, { isActive: false });
    return { success: true };
  }
}