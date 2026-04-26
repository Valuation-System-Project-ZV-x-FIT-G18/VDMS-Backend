import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAccountSettingDto {
  @IsOptional()
  @IsString()
  bankName?: string | null;

  @IsOptional()
  @IsString()
  branch?: string | null;

  @IsOptional()
  @IsString()
  contactPersonName?: string | null;

  @IsOptional()
  @IsString()
  fullName?: string | null;

  @IsOptional()
  @IsString()
  nationalId?: string | null;

  @IsOptional()
  @IsString()
  residentialAddress?: string | null;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  smsAlerts?: boolean;

  @IsOptional()
  @IsDateString()
  lastPasswordChangeAt?: string | null;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: string | null;

  @IsOptional()
  @IsString()
  lastLoginIp?: string | null;
}