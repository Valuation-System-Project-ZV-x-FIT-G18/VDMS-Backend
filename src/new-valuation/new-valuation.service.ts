import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignedTo } from '../entities/assigned-to.entity';
import { FreeOfficer } from '../entities/free-officer.entity';
import { TechnicalOfficer } from '../entities/technical-officer.entity';
import { User } from '../entities/user.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { Project } from '../entities/project.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { ProjectValuation } from '../entities/project-valuation.entity';
import { Property } from '../entities/property.entity';
import { UserRole } from '../enums/user-role.enum';
import { NewValuationDto } from './dto/new-valuation.dto';

@Injectable()
export class NewValuationService {
  constructor(
    @InjectRepository(TechnicalOfficer)
    private readonly officerRepo: Repository<TechnicalOfficer>,
    @InjectRepository(FreeOfficer)
    private readonly freeRepo: Repository<FreeOfficer>,
    @InjectRepository(AssignedTo)
    private readonly assignedRepo: Repository<AssignedTo>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(LoanApplicant)
    private readonly loanApplicantRepo: Repository<LoanApplicant>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectLoanApplicant)
    private readonly projectLoanApplicantRepo: Repository<ProjectLoanApplicant>,
    @InjectRepository(ProjectValuation)
    private readonly linkRepo: Repository<ProjectValuation>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async getFreeOfficers() {
    const freeRows = await this.freeRepo.find({
      relations: ['officer'],
      order: { id: 'DESC' },
    });

    const seen = new Set<string>();
    const officers = freeRows
      .map((row) => row.officer)
      .filter((officer): officer is TechnicalOfficer => !!officer)
      .filter((officer) => {
        if (seen.has(officer.to_id)) return false;
        seen.add(officer.to_id);
        return true;
      });

    return officers;
  }

  async assign(dto: NewValuationDto) {
    const user = await this.userRepo.findOne({
      where: { nic: dto.nic, role: UserRole.LOAN_APPLICANT },
    });

    const loanApplicant = user
      ? await this.loanApplicantRepo.findOne({
          where: { user: { user_id: user.user_id } },
          relations: ['user'],
        })
      : null;

    const linkedProject = loanApplicant
      ? await this.projectLoanApplicantRepo
          .createQueryBuilder('projectLoanApplicant')
          .select('projectLoanApplicant.project_id', 'project_id')
          .where('projectLoanApplicant.loan_applicant_id = :loanApplicantId', {
            loanApplicantId: loanApplicant.loan_applicant_id,
          })
          .orderBy('projectLoanApplicant.id', 'DESC')
          .getRawOne<{ project_id: string }>()
      : null;

    let projectId = linkedProject?.project_id;
    if (!projectId) {
      const userScopedProject = user
        ? await this.projectRepo.query(
            `SELECT project_id
             FROM valuation_projects
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 1`,
            [user.user_id],
          )
        : [];

      projectId = userScopedProject?.[0]?.project_id;

      if (!projectId) {
        const latestProject = await this.projectRepo.query(
          `SELECT project_id
           FROM valuation_projects
           ORDER BY created_at DESC
           LIMIT 1`,
        );
        projectId = latestProject?.[0]?.project_id;
      }
    }

    if (!projectId) return { success: false, message: 'Project not found' };

    const property = user
      ? await this.propertyRepo.findOne({
          where: { user: { user_id: user.user_id } },
          relations: ['user'],
          order: { property_id: 'DESC' },
        })
      : null;

    const assignmentInsert = await this.assignedRepo.query(
      `INSERT INTO assigned_to (to_id, time_date, project_id, loan_applicant_nic, property_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [dto.toId, new Date(dto.timeDate), projectId, dto.nic, property?.address ?? null],
    );
    const assignmentId = assignmentInsert?.[0]?.id;

    const last = await this.linkRepo
      .createQueryBuilder('projectValuation')
      .select('projectValuation.valuation_id', 'valuation_id')
      .where('projectValuation.project_id = :projectId', { projectId })
      .orderBy('projectValuation.valuation_id', 'DESC')
      .getRawOne<{ valuation_id: number }>();

    const valuationId = (last?.valuation_id ?? 0) + 1;

    await this.linkRepo.query(
      `INSERT INTO project_valuation (valuation_id, project_id, assigned_to_id)
       VALUES ($1, $2, $3)`,
      [valuationId, projectId, assignmentId],
    );

    await this.freeRepo.delete({ to_id: dto.toId });
    return {
      success: true,
      assignmentId,
      projectId,
      valuationId,
    };
  }
}
