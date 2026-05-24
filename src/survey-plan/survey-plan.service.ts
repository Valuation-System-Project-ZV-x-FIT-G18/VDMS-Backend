import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { SurveyPlan } from '../entities/survey-plan.entity';
import { User } from '../entities/user.entity'; // to look up user by NIC
import { SurveyPlanDto } from './dto/survey-plan.dto';

@Injectable()
export class SurveyPlanService {
  constructor(
    @InjectRepository(SurveyPlan) private readonly repo: Repository<SurveyPlan>,
    @InjectRepository(User) private readonly userRepo: Repository<User>, // inject User repo
  ) {}

  /* Save a new survey plan record with auto-generated ID */
  async save(dto: SurveyPlanDto) {
    const user = await this.userRepo.findOne({ where: { nic: dto.nic } }); // find user by NIC
    const count = await this.repo.count(); // count existing rows
    const surveyId = `srv${String(count + 1).padStart(3, '0')}`; // e.g. srv001

    const data: DeepPartial<SurveyPlan> = {
      survey_id: surveyId,
      user: user ?? undefined, // link to user (FK)
      plan_number: dto.planNumber,
      surveyor_name: dto.surveyorName,
      boundary_details: dto.boundaryDetails,
      lot_number: dto.lotNumber,
      land_shape: dto.landShape,
      file_path: dto.filePath || undefined,
    };

    const plan = this.repo.create(data); // build entity instance
    await this.repo.save(plan); // persist to database

    return { success: true, surveyId }; // return generated ID
  }
}
