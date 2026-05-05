import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ManagerRole } from '../../../entities/manager.entity';

export class CreateManagerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(ManagerRole)
  role!: ManagerRole;

  @IsString()
  phone?: string;
}

export class UpdateManagerDto {
  @IsString()
  @MinLength(2)
  name?: string;

  @IsString()
  phone?: string;

  isActive?: boolean;
}

export class ManagerResponseDto {
  id!: string;
  name!: string;
  email!: string;
  role!: ManagerRole;
  phone?: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
