import { IsIn, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'; // validation decorators

const LAND_SHAPES = ['Square', 'Rectangle', 'Circle', 'Irregular'];

/* Validates the survey plan request body */
export class SurveyPlanDto {
  @IsString() @IsNotEmpty() nic: string; // NIC of the registered client

  @IsString()
  @IsNotEmpty()
  @Matches(/^sp\/\d{4}\/[A-Za-z0-9]{3}$/i, {
    message: 'Survey plan number must be in format SP/YYYY/XXX (SP or sp)',
  })
  planNumber: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Surveyor name can contain only letters and spaces' })
  surveyorName: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 500)
  boundaryDetails: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, { message: 'Lot number must be alphanumeric' })
  lotNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(LAND_SHAPES, { message: 'Land shape must be Square, Rectangle, Circle, or Irregular' })
  landShape: string;

  @IsOptional() @IsString() filePath?: string; // optional uploaded file path
}
