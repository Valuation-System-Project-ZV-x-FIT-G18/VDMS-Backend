import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  FileUploadValidateDto,
  IsMeaningfulTextWords,
  IsNotFutureDate,
} from './common.validate';

export class DeedInformationValidateDto {
  @IsString()
  @IsNotEmpty()
  deedNumber!: string;

  @IsString()
  @IsNotEmpty()
  deedType!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString({}, { message: 'Registration date must be a valid date' })
  @IsNotFutureDate({ message: 'Registration date cannot be a future date' })
  registrationDate!: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 150)
  notaryDetails!: string;

  @IsString()
  @IsNotEmpty()
  ownershipType!: string;

  @IsString()
  @IsNotEmpty()
  @IsMeaningfulTextWords(2, 150, {
    message: 'Environmental usage regulation must be 2 to 150 meaningful words',
  })
  environmentalUsage!: string;

  @IsString()
  @IsNotEmpty()
  @IsMeaningfulTextWords(2, 150, {
    message: 'Building usage regulation must be 2 to 150 meaningful words',
  })
  buildingUsage!: string;

  @IsString()
  @IsNotEmpty()
  @IsMeaningfulTextWords(2, 150, {
    message: 'Zoning usage regulation must be 2 to 150 meaningful words',
  })
  zoningUsage!: string;

  @IsString()
  @IsNotEmpty()
  @IsMeaningfulTextWords(2, 150, {
    message: 'Heritage usage regulation must be 2 to 150 meaningful words',
  })
  heritageUsage!: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => FileUploadValidateDto)
  deedCopy!: FileUploadValidateDto;
}
