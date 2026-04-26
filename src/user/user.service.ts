import { Injectable } from '@nestjs/common'; // marks as injectable service
import { InjectRepository } from '@nestjs/typeorm'; // injects TypeORM repo
import { Repository } from 'typeorm'; // generic repo type
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // inject the User repository
    private readonly userRepo: Repository<User>,
  ) {}

  /* Find a user by their NIC number */
  findByNic(nic: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { nic } });
  }
}
