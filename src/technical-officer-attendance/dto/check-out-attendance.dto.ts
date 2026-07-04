import { IsNotEmpty, IsString } from 'class-validator';

// Validates check-out request body.
export class CheckOutAttendanceDto {
  @IsString()
  @IsNotEmpty()
  officerName!: string;
}
