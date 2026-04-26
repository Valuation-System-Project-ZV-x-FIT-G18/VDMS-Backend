import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsDateString,
} from 'class-validator'; // validators

/* Validates the legal details request body */
export class LegalDetailsDto {
  @IsString() @IsNotEmpty() nic: string; // NIC of the registered client
  @IsString() @IsNotEmpty() deedNumber: string; // deed number
  @IsString() @IsNotEmpty() deedType: string; // type of deed
  @IsDateString() registrationDate: string; // registration date (YYYY-MM-DD)
  @IsString() @IsNotEmpty() notaryDetails: string; // notary name/details
  @IsString() @IsNotEmpty() ownershipType: string; // Single Owner | Joint Ownership
  @IsOptional() @IsArray() usageRegulations?: string[]; // restrictions list
  @IsOptional() @IsString() filePath?: string; // optional uploaded deed file
}
