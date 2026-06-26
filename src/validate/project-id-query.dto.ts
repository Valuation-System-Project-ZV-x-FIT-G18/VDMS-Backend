import { IsValidProjectId } from './project-id.validation';

export class ProjectIdQueryDto {
  @IsValidProjectId()
  projectId!: string;
}
