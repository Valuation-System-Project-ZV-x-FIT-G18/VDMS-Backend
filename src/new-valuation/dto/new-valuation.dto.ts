import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IsFutureDateTime, IsWithinWorkingHours } from '../../validate';

export class NewValuationDto {
  @IsString() @IsNotEmpty() toId!: string; // technical officer ID

  @IsString()
  @IsNotEmpty()
  @IsDateString({}, { message: 'Schedule date and time must be a valid date/time' })
  @IsFutureDateTime({ message: 'Schedule date and time must be in the future' })
  @IsWithinWorkingHours({ message: 'Schedule must be within working hours (08:00–16:59)' })
  timeDate!: string;

  @IsString() @IsNotEmpty() nic!: string;
  @IsString() @IsNotEmpty() requestLetter!: string; // stored file path

  @IsString()
  @IsNotEmpty({ message: 'Purpose of valuation must be required' })
  purpose!: string;
}
