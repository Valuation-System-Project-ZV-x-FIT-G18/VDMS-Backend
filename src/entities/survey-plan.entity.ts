import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity'; // FK to users table

@Entity('survey_plans') // maps to "survey_plans" table
export class SurveyPlan {
  @PrimaryColumn({ length: 6 }) // e.g. srv001
  survey_id: string;

  @ManyToOne(() => User) // which user this survey belongs to
  @JoinColumn({ name: 'user_id' }) // FK column in survey_plans table
  user!: User;

  @Column() // official survey plan number
  plan_number: string;

  @Column() // name of the surveyor
  surveyor_name: string;

  @Column({ type: 'text' }) // boundary details (free text)
  boundary_details: string;

  @Column() // lot number within the plan
  lot_number: string;

  @Column() // square | rectangle | circle | irregular
  land_shape: string;

  @Column({ nullable: true }) // file path for uploaded survey plan copy
  file_path: string;
}
