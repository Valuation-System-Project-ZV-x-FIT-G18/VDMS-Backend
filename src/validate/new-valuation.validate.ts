import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  FileUploadValidateDto,
  IsFutureDateTime,
  IsWithinWorkingHours,
} from './common.validate';

export class NewValuationValidateDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => FileUploadValidateDto)
  requestLetter!: FileUploadValidateDto;

  @IsString()
  @IsNotEmpty({ message: 'Purpose of valuation must be required' })
  purposeOfValuation!: string;

  @IsString()
  @IsNotEmpty()
  technicalOfficer!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString({}, { message: 'Schedule date and time must be a valid date/time' })
  @IsFutureDateTime({ message: 'Schedule date and time must be in the future' })
  @IsWithinWorkingHours({
    message: 'Schedule date and time must be within working hours (08:00-16:59)',
  })
  scheduleDateTime!: string;
}
