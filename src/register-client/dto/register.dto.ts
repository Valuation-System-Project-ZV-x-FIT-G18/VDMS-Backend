import { IsNotEmpty, IsString } from 'class-validator';
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
  IsValidPostalCode,
  IsValidProvince,
  IsValidStreetAddress,
} from '../../validation';

/* Validates the incoming registration request body */
export class RegisterDto {
  @IsValidFullName() fullName: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() nameWithInitials: string;
  @IsValidNic() nic: string;
  @IsValidBirthDay() dateOfBirth: string;
  @IsValidContactNumber() phone: string;
  @IsValidEmailField() email: string;
  @IsValidPassword() password: string;
  @IsValidConfirmPassword() confirmPassword: string;
  @IsValidStreetAddress() streetAddress: string;
  @IsValidCity() city: string;
  @IsValidDistrict() district: string;
  @IsValidProvince() province: string;
  @IsValidPostalCode() postalCode: string;
}
