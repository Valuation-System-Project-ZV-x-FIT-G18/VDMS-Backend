import { IsNotEmpty, IsString } from 'class-validator';

export class CheckOutAttendanceDto {
  @IsString()
  @IsNotEmpty()
  officerName!: string;
}
