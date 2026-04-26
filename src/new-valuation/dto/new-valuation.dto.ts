import { IsDateString, IsString } from 'class-validator';

export class NewValuationDto {
  @IsString() toId!: string;
  @IsDateString() timeDate!: string;
  @IsString() nic!: string;
  @IsString() requestLetter!: string;
  @IsString() purpose!: string;
}
