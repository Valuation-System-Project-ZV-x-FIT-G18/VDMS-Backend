import { IsNotEmpty, IsString } from 'class-validator';

// Validates the Technical Officer's response to a clarification request.
export class ClarificationResponseDto {
  @IsString()
  @IsNotEmpty()
  clarificationResponse!: string;
}
