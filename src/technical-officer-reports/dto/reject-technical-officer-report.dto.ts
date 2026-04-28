import { IsNotEmpty, IsString } from 'class-validator';

export class RejectTechnicalOfficerReportDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason!: string;
}
