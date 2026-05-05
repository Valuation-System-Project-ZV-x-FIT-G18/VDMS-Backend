import { IsEnum, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApprovalStatus, ApprovalType } from '../../../entities/approval.entity';

export class CreateApprovalDto {
  @IsUUID()
  projectId!: string;

  @IsEnum(ApprovalType)
  approvalType!: ApprovalType;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class UpdateApprovalDto {
  @IsEnum(ApprovalStatus)
  status!: ApprovalStatus;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class ApprovalResponseDto {
  id!: string;
  projectId!: string;
  managerId!: string;
  approvalType!: ApprovalType;
  status!: ApprovalStatus;
  comments?: string;
  priority?: string;
  createdAt!: Date;
  updatedAt!: Date;
  processedAt?: Date;
}
