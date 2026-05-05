import { IsNotEmpty, IsString, Length, Matches, ValidateIf } from 'class-validator';
import {
  IsValidBirthDay,
  IsValidCity,
  IsValidConfirmPassword,
  IsValidContactNumber,
  IsValidDistrict,
  IsValidEmailField,
  IsValidFullName,
  IsValidNic,
  IsValidPassword,
  IsValidProvince,
  IsValidStreetAddress,
} from '../../validate';

/* Validates the incoming registration request body */
export class RegisterDto {
  @IsValidFullName()
  @Length(3, 100, { message: 'Full name must be between 3 and 100 characters' })
  fullName: string;

  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() nameWithInitials: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{12}|\d{9}[VvUu])$/, {
    message: 'NIC must be 12 digits or 9 digits ending with V or U',
  })
  nic: string;

  @IsValidBirthDay() dateOfBirth: string;

  @Matches(/^0\d{9}$/, { message: 'Contact number must be 10 digits and start with 0' })
  @IsValidContactNumber()
  phone: string;

  @IsValidEmailField() email: string;
  @IsValidPassword() password: string;
  @IsValidConfirmPassword() confirmPassword: string;

  @IsValidStreetAddress()
  @Length(5, 150, { message: 'Street address must be between 5 and 150 characters' })
  @Matches(/^[A-Za-z0-9,./\-#'\s]+$/, {
    message: 'Street address contains invalid characters',
  })
  streetAddress: string;

  @IsValidCity()
  @Length(2, 100, { message: 'City must be at least 2 characters' })
  city: string;

  @IsValidDistrict() district: string;
  @IsValidProvince() province: string;

  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @Matches(/^\d{5}$/, { message: 'Postal code must be exactly 5 digits' })
  postalCode?: string;
}
