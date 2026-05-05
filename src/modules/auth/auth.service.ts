import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Manager } from '../../entities/manager.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const manager = await this.managerRepository.findOne({ where: { email } });
    if (!manager) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, manager.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: manager.id, email: manager.email, role: manager.role };
    return {
      accessToken: this.jwtService.sign(payload),
      manager: {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
      },
    };
  }

  async getProfile(id: string) {
    return this.managerRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'phone', 'avatar'],
    });
  }
}