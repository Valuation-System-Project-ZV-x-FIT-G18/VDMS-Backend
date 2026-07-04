import { IsOptional, IsString, IsUUID } from 'class-validator';

// Validates request body when updating a report; all fields are optional.
export class UpdateTechnicalOfficerReportDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  reportTitle?: string;

  @IsOptional()
  @IsString()
  inspectionNotes?: string;

  @IsOptional()
  @IsString()
  valuationSummary?: string;

  @IsOptional()
  @IsString()
  recommendation?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  clarificationRequest?: string;

  @IsOptional()
  @IsString()
  clarificationResponse?: string;
}
