import { IsNotEmpty, IsString } from 'class-validator';

// Validates check-in request body.
export class CheckInAttendanceDto {
  @IsString()
  @IsNotEmpty()
  officerName!: string;
}
