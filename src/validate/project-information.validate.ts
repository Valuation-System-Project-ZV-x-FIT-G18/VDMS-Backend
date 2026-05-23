import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ProjectInformationValidateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^pro\d{3}$/i, {
    message: 'Project ID must be in format pro followed by 3 digits',
  })
  projectId!: string;
}
