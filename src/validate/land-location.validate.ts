import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

const LAND_TYPES = ['Residential', 'Commercial', 'Agricultural'] as const;

export class LandLocationValidateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Local authority can contain only letters and spaces',
  })
  localAuthority!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([...LAND_TYPES], {
    message: 'Land type must be Residential, Commercial, or Agricultural',
  })
  landType!: (typeof LAND_TYPES)[number];

  @IsNotEmpty()
  @IsLatitude({ message: 'Latitude must be a valid coordinate' })
  latitude!: string;

  @IsNotEmpty()
  @IsLongitude({ message: 'Longitude must be a valid coordinate' })
  longitude!: string;
}
