import { IsNotEmpty, IsString } from 'class-validator';

export class ClarificationResponseDto {
  @IsString()
  @IsNotEmpty()
  clarificationResponse!: string;
}
