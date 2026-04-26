import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  IsValidBankName,
  IsValidBranch,
  IsValidBranchCode,
  IsValidContactNumber,
  IsValidEmailField,
  IsValidFullName,
  IsValidNic,
} from '../../validation';

/* Validates the bank officer registration request body */
export class RegisterBankDto {
  @IsValidFullName() fullName: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() nameWithInitials: string;
  @IsValidNic() nic: string;
  @IsOptional() @IsString() designation?: string;
  @IsValidContactNumber() phone: string;
  @IsValidEmailField() email: string;
  @IsValidBankName() bankName: string;
  @IsValidBranch() branch: string;
  @IsValidBranchCode() branchCode: string; // bank branch code e.g. "7010"
  @IsValidNic('Applicant NIC', { optional: true }) applicantNic?: string; // loan applicant NIC for project linkage
}
