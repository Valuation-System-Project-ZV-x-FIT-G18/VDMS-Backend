import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TechnicalOfficerProjectStatus } from '../../entities/technical-officer-project.entity';

export class CreateTechnicalOfficerProjectDto {
  @IsString()
  @IsNotEmpty()
  projectCode!: string;

  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsDateString()
  deadline!: string;

  @IsOptional()
  @IsEnum(TechnicalOfficerProjectStatus)
  status?: TechnicalOfficerProjectStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsString()
  @IsNotEmpty()
  assignedOfficerName!: string;
}
