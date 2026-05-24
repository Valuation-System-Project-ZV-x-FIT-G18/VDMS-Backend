import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTechnicalOfficerReportDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  reportTitle!: string;

  @IsString()
  @IsNotEmpty()
  inspectionNotes!: string;

  @IsString()
  @IsNotEmpty()
  valuationSummary!: string;

  @IsString()
  @IsNotEmpty()
  recommendation!: string;

  @IsOptional()
  @IsString()
  status?: string;
}
