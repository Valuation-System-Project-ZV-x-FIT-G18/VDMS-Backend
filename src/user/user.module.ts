import { Module } from '@nestjs/common'; // NestJS module decorator
import { TypeOrmModule } from '@nestjs/typeorm'; // registers entity repos
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // makes UserRepository available
  providers: [UserService], // service for business logic
  exports: [UserService], // expose to other modules
})
export class UserModule {}
