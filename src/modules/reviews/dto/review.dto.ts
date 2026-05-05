import { IsEnum, IsString, IsOptional, IsUUID, MinLength } from 'class-validator';
import { ReviewStatus } from '../../../entities/review.entity';

export class CreateReviewDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @MinLength(10)
  content!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUUID()
  parentReviewId?: string; // For revisions
}

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @IsOptional()
  @IsString()
  feedback?: string;
}

export class SubmitReviewDto {
  @IsOptional()
  @IsString()
  feedback?: string;
}

export class ReviewResponseDto {
  id!: string;
  projectId!: string;
  managerId!: string;
  title?: string;
  content!: string;
  status!: ReviewStatus;
  feedback?: string;
  version!: number;
  createdAt!: Date;
  updatedAt!: Date;
  submittedAt?: Date;
  approvedAt?: Date;
}
