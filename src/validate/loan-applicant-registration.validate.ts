import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { IsMinAge, IsNotFutureDate, MatchField } from './common.validate';

export class LoanApplicantRegistrationValidateDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name can contain only letters and spaces',
  })
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{12}|\d{9}[VvUu])$/, {
    message: 'NIC must be 12 digits or 9 digits ending with V or U',
  })
  nic!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  @IsNotFutureDate({ message: 'Date of birth cannot be in the future' })
  @IsMinAge(18, { message: 'Loan applicant must be at least 18 years old' })
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0\d{9}$/, {
    message: 'Contact number must be 10 digits and start with 0',
  })
  contactNumber!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must contain @ and a valid domain with dot' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must include letters and numbers',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MatchField('password', {
    message: 'Confirm password must match password exactly',
  })
  confirmPassword!: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 150)
  @Matches(/^[A-Za-z0-9,\s]+$/, {
    message: 'Street address can contain letters, numbers, commas and spaces',
  })
  streetAddress!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'City can contain only letters and spaces',
  })
  city!: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @Matches(/^\d{5}$/, {
    message: 'Postal code must be exactly 5 digits',
  })
  postalCode?: string;
}
