import { IsString, IsEmail, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

/* Validates the incoming registration request body */
export class RegisterDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() nameWithInitials: string;
  @IsString() @IsNotEmpty() nic: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;         // coordinator-set temp password — min 6 chars
  @MinLength(6) confirmPassword: string;
  @IsString() @IsNotEmpty() streetAddress: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() district: string;
  @IsString() @IsNotEmpty() province: string;
  @IsOptional() @IsString() postalCode?: string;
}
