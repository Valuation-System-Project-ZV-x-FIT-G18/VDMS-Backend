import { IsString, IsOptional } from 'class-validator'; // validation decorators

/* Validates the property information request body */
export class PropertyInformationDto {
  @IsString() nic: string; // NIC of the registered client
  @IsString() address: string; // street address
  @IsString() city: string; // city name
  @IsString() district: string; // district name
  @IsString() province: string; // province name
  @IsString() localAuthority: string; // governing authority
  @IsString() landType: string; // residential | commercial | agricultural
  @IsOptional() @IsString() latitude?: string; // GPS latitude as string
  @IsOptional() @IsString() longitude?: string; // GPS longitude as string
}
