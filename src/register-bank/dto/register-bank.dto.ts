import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  Matches,
} from 'class-validator';

/* Validates the bank officer registration request body */
export class RegisterBankDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() nameWithInitials: string;
  @IsString() @IsNotEmpty() @Matches(/^(\d{12}|\d{9}[VvXx])$/) nic: string;
  @IsOptional() @IsString() designation?: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() bankName: string;
  @IsString() @IsNotEmpty() branch: string;
  @IsString() @IsNotEmpty() branchCode: string; // bank branch code e.g. "7010"
  @IsOptional() @IsString() applicantNic?: string; // loan applicant NIC for project linkage
}
