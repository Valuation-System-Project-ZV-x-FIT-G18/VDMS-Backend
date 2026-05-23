import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';

@Injectable()
export class LoanApplicantService {
  constructor(
    @InjectRepository(LoanApplicant)
    private readonly loanRepo: Repository<LoanApplicant>,

    @InjectRepository(ProjectLoanApplicant)
    private readonly junctionRepo: Repository<ProjectLoanApplicant>,
  ) {}

  /* Find a loan applicant by NIC — joins through user relation */
  findByNic(nic: string): Promise<LoanApplicant | null> {
    return this.loanRepo.findOne({
      where: { user: { nic } }, // filter on joined user's NIC
      relations: ['user'], // eagerly load user data
    });
  }

  /* Find the junction row by project ID — loads both sides */
  findByProjectId(projectId: string): Promise<ProjectLoanApplicant | null> {
    return this.junctionRepo
      .createQueryBuilder('projectLoanApplicant')
      .leftJoinAndSelect(
        'projectLoanApplicant.loan_applicant',
        'loanApplicant',
      )
      .leftJoinAndSelect('loanApplicant.user', 'user')
      .where('projectLoanApplicant.project_id = :projectId', { projectId })
      .orderBy('projectLoanApplicant.id', 'DESC')
      .getOne();
  }
}
