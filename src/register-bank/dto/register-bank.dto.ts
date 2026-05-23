import { IsNotEmpty, IsOptional, IsString, Length, Matches, ValidateIf } from 'class-validator';
import {
  IsValidBankName,
  IsValidBranch,
  IsValidContactNumber,
  IsValidEmailField,
  IsValidFullName,
  IsValidNic,
} from '../../validate';

/* Validates the bank officer registration request body */
export class RegisterBankDto {
  @IsValidFullName() fullName: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() nameWithInitials: string;
  @IsValidNic() nic: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @Length(2, 100, { message: 'Designation must be at least 2 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Designation can contain only letters and spaces' })
  designation?: string;

  @IsValidContactNumber() phone: string;
  @IsValidEmailField() email: string;
  @IsValidBankName() bankName: string;
  @IsValidBranch() branch: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3,5}$/, { message: 'Branch code must be 3 to 5 digits' })
  branchCode: string;

  @IsValidNic('Applicant NIC', { optional: true }) applicantNic?: string; // loan applicant NIC for project linkage
}
