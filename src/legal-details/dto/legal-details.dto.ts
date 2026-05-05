import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsValidLegalRegistrationDate } from '../../validate';
import { IsMeaningfulTextWords } from '../../validate';

/* Validates the legal details request body */
export class LegalDetailsDto {
  @IsString() @IsNotEmpty() nic: string; // NIC of the registered client
  @IsString() @IsNotEmpty() deedNumber: string; // deed number
  @IsString() @IsNotEmpty() deedType: string; // type of deed
  @IsValidLegalRegistrationDate() registrationDate: string; // registration date (YYYY-MM-DD)

  @IsString()
  @IsNotEmpty()
  @Length(5, 150, { message: 'Notary details must be between 5 and 150 characters' })
  notaryDetails: string;

  @IsString() @IsNotEmpty() ownershipType: string; // Single Owner | Joint Ownership

  @IsOptional()
  @IsArray()
  usageRegulations?: string[]; // restrictions list

  @IsOptional()
  @IsString()
  @IsMeaningfulTextWords(2, 150, { message: 'Environmental regulation must contain 2–150 meaningful words' })
  environmentalUsage?: string;

  @IsOptional()
  @IsString()
  @IsMeaningfulTextWords(2, 150, { message: 'Building regulation must contain 2–150 meaningful words' })
  buildingUsage?: string;

  @IsOptional()
  @IsString()
  @IsMeaningfulTextWords(2, 150, { message: 'Zoning regulation must contain 2–150 meaningful words' })
  zoningUsage?: string;

  @IsOptional()
  @IsString()
  @IsMeaningfulTextWords(2, 150, { message: 'Heritage regulation must contain 2–150 meaningful words' })
  heritageUsage?: string;

  @IsOptional() @IsString() filePath?: string; // optional uploaded deed file
}
