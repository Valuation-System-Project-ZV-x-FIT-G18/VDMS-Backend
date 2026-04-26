import { IsString, IsOptional, IsNotEmpty } from 'class-validator'; // validators

// DTO for uploading all document types for a user
export class DocumentUploadDto {
  @IsString()
  @IsNotEmpty()
  nic!: string;

  @IsString()
  @IsOptional()
  nicFileName?: string;

  @IsString()
  @IsOptional()
  nicFilePath?: string;

  @IsString()
  @IsOptional()
  taxFileName?: string;

  @IsString()
  @IsOptional()
  taxFilePath?: string;

  @IsString()
  @IsOptional()
  utilityFileName?: string;

  @IsString()
  @IsOptional()
  utilityFilePath?: string;

  @IsString()
  @IsOptional()
  otherFileName?: string;

  @IsString()
  @IsOptional()
  otherFilePath?: string;
}
