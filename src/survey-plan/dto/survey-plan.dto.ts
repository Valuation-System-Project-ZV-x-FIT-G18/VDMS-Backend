import { IsString, IsOptional } from 'class-validator'; // validation decorators

/* Validates the survey plan request body */
export class SurveyPlanDto {
  @IsString() nic: string; // NIC of the registered client
  @IsString() planNumber: string; // survey plan number
  @IsString() surveyorName: string; // name of surveyor
  @IsString() boundaryDetails: string; // boundary description
  @IsString() lotNumber: string; // lot number
  @IsString() landShape: string; // shape of land
  @IsOptional() @IsString() filePath?: string; // optional uploaded file path
}
