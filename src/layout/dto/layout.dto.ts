import { IsString } from 'class-validator'; // validator decorator

/* DTO for requesting layout/menu config — just needs the role name */
export class LayoutQueryDto {
  @IsString()
  role: string; // e.g. "coordinator", "bank", "technical_officer"
}
