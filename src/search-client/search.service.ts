import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplicantService } from '../loan-applicant/loan-applicant.service';
import { Project } from '../entities/project.entity';

@Injectable()
export class SearchService {
  constructor(
    private readonly loanService: LoanApplicantService,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>, // to find latest project by user NIC
  ) {}

  /* Search by NIC or project ID based on the type parameter */
  async search(query: string, type: string) {
    if (!query) return { found: false }; // guard: empty query

    const trimmed = query.trim(); // remove whitespace

    /* If type is project_id, search in project table via junction */
    if (type === 'project_id') {
      const junction = await this.loanService.findByProjectId(trimmed);
      if (!junction) return { found: false }; // no matching project

      const user = junction.loan_applicant.user; // drill into user data
      return {
        found: true,
        name: user.full_name,
        nic: user.nic,
        email: user.email,
        projectId: trimmed,
      };
    }

    /* Otherwise type is nic — search in loan applicant table */
    const applicant = await this.loanService.findByNic(trimmed);
    if (!applicant) return { found: false }; // no matching NIC

    /* Find the latest valuation project linked to this user */
    const projectRows = await this.projectRepo.query(
      `SELECT project_id
       FROM valuation_projects
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [applicant.user.user_id],
    );

    return {
      found: true,
      name: applicant.user.full_name,
      nic: applicant.user.nic,
      email: applicant.user.email,
      projectId: projectRows?.[0]?.project_id ?? null,
    };
  }
}
