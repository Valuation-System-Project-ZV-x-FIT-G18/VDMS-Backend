import { IsNotEmpty, IsString } from 'class-validator';

// Validates the rejection reason sent by the reviewer.
export class RejectTechnicalOfficerReportDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason!: string;
}
