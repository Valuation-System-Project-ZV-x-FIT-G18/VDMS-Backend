import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Local lightweight User definition to avoid import path issues when the
// actual entity module isn't present at the expected path. This defines
// the properties used by this service. If you have a proper
// entities/user.entity.ts file, replace this with the correct import.
export class User {
  id: string | undefined;
  firstName?: string;
  lastName?: string;
  email: string | undefined;
  role?: string;
  department?: string;
  status?: string;
  photo?: string;
  phone?: string;
  createdAt?: Date;
  password?: string;
  resetToken?: string | null;
  googleId?: string | null;
}
import * as bcrypt from 'bcryptjs';

type CreateUserDto = Partial<User> & { email: string; password?: string };

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
    if (data.email && data.email !== user.email) {
      const existing = await this.repo.findOne({ where: { email: data.email } });
      if (existing) throw new ConflictException('Email already in use');
    }

    if (data.password) {
      // hash new password before saving
      user.password = await bcrypt.hash(data.password, 12);
      // don't copy raw password further
      delete data.password;
    }

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