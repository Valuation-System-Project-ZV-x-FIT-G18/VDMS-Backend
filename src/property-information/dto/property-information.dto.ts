import { IsIn, IsLatitude, IsLongitude, IsNotEmpty, IsString, Matches } from 'class-validator';

const LAND_TYPES = ['Residential', 'Commercial', 'Agricultural'];

/* Validates the property information request body */
export class PropertyInformationDto {
  @IsString() @IsNotEmpty() nic: string; // NIC of the registered client

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9,\s]+$/, { message: 'Address can contain only letters, numbers, commas and spaces' })
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'City can contain only letters and spaces' })
  city: string;

  @IsString() @IsNotEmpty() district: string;
  @IsString() @IsNotEmpty() province: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Local authority can contain only letters and spaces' })
  localAuthority: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(LAND_TYPES, { message: 'Land type must be Residential, Commercial, or Agricultural' })
  landType: string;

  @IsNotEmpty({ message: 'Latitude is required' })
  @IsLatitude({ message: 'Latitude must be a valid coordinate' })
  latitude: string;

  @IsNotEmpty({ message: 'Longitude is required' })
  @IsLongitude({ message: 'Longitude must be a valid coordinate' })
  longitude: string;
}
