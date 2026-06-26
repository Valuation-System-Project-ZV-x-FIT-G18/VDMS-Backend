import { Type } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { FileUploadValidateDto } from './common.validate';

const LAND_SHAPES = ['Square', 'Rectangle', 'Circle', 'Irregular'] as const;

export class SurveyPlanValidateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^sp\/\d{4}\/[A-Za-z0-9]{3}$/i, {
    message: 'Survey plan number must be in format SP/YYYY/XXX (SP or sp)',
  })
  surveyPlanNumber!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Surveyor name can contain only letters and spaces',
  })
  surveyorName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Lot number must be alphanumeric',
  })
  lotNumber!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'North boundary must contain letters and spaces only',
  })
  northBoundary!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'South boundary must contain letters and spaces only',
  })
  southBoundary!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'East boundary must contain letters and spaces only',
  })
  eastBoundary!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'West boundary must contain letters and spaces only',
  })
  westBoundary!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([...LAND_SHAPES], {
    message: 'Land shape must be Square, Rectangle, Circle, or Irregular',
  })
  landShape!: (typeof LAND_SHAPES)[number];

  @IsDefined()
  @ValidateNested()
  @Type(() => FileUploadValidateDto)
  surveyPlanCopy!: FileUploadValidateDto;
}
