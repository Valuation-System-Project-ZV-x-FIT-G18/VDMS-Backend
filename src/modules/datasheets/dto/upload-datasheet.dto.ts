import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadDatasheetDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsOptional()
  projectCode?: string;

  @IsString()
  @IsOptional()
  uploadedBy?: string;
}
