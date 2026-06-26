import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TechnicalOfficerProjectStatus } from '../../entities/technical-officer-project.entity';

// Validates request body when updating a project; all fields are optional.
export class UpdateTechnicalOfficerProjectDto {
  @IsOptional()
  @IsString()
  projectCode?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsEnum(TechnicalOfficerProjectStatus)
  status?: TechnicalOfficerProjectStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsString()
  assignedOfficerName?: string;
}
