import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findAll() {
    return this.repo.find({
      select: ['id','firstName','lastName','email','role','department','status','photo','phone','createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.resetToken')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByGoogleId(googleId: string) {
    return this.repo.findOne({ where: { googleId } });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const user = this.repo.create(dto);
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 12);
    }
    return this.repo.save(user);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }

  async getStats() {
    const total = await this.repo.count();
    const active = await this.repo.count({ where: { status: 'active' } });
    return { total, active };
  }
}