import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { BankOfficer } from '../entities/bank-officer.entity';
import { Project } from '../entities/project.entity';
import { Property } from '../entities/property.entity';
import { SurveyPlan } from '../entities/survey-plan.entity';
import { LegalDetail } from '../entities/legal-detail.entity';
import { DocumentUpload } from '../entities/document-upload.entity';

@Injectable()
export class ProjectSummaryService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LoanApplicant)
    private readonly loanRepo: Repository<LoanApplicant>,
    @InjectRepository(ProjectLoanApplicant)
    private readonly junctionRepo: Repository<ProjectLoanApplicant>,
    @InjectRepository(BankOfficer)
    private readonly bankOfficerRepo: Repository<BankOfficer>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(SurveyPlan)
    private readonly surveyRepo: Repository<SurveyPlan>,
    @InjectRepository(LegalDetail)
    private readonly legalRepo: Repository<LegalDetail>,
    @InjectRepository(DocumentUpload)
    private readonly docRepo: Repository<DocumentUpload>,
  ) {}

  /* Aggregate all stored data for a client identified by NIC */
  async getSummary(nic: string) {
    try {
      const user = await this.userRepo.findOne({ where: { nic } });
      if (!user) return { found: false, error: 'User not found' };

      const loanApplicant = await this.loanRepo.findOne({
        where: { user: { user_id: user.user_id } },
        relations: ['user'],
      });

      let project: Project | null = null;
      project = await this.projectRepo.findOne({
        where: { user: { user_id: user.user_id } },
        relations: ['bank', 'bankOfficer', 'bankOfficer.user'],
        order: { project_id: 'DESC' },
      });

      const property = await this.propertyRepo.findOne({
        where: { user: { user_id: user.user_id } },
        relations: ['user'],
        order: { property_id: 'DESC' },
      });

      const survey = await this.surveyRepo.findOne({
        where: { user: { user_id: user.user_id } },
        relations: ['user'],
        order: { survey_id: 'DESC' },
      });

      const legal = await this.legalRepo.findOne({
        where: { user: { user_id: user.user_id } },
        relations: ['user'],
        order: { legal_id: 'DESC' },
      });

      const documents = await this.docRepo.find({
        where: { user: { user_id: user.user_id } },
        relations: ['user'],
        order: { uploaded_at: 'DESC' },
      });

      return {
        found: true,
        client: {
          full_name: user.full_name,
          nic: user.nic,
          email: user.email,
          phone: user.phone,
          date_of_birth: user.date_of_birth,
          street_address: user.street_address,
          city: user.city,
          district: user.district,
          province: user.province,
          postal_code: user.postal_code,
        },
        bank: project && project.bank
          ? {
              bank_name: project.bank.bank_name,
              branch: project.bank.branch,
              branch_code: project.bank.branch_code,
            }
          : null,
        bankOfficer: project && project.bankOfficer && project.bankOfficer.user
          ? {
              name: project.bankOfficer.user.full_name,
              email: project.bankOfficer.user.email,
              phone: project.bankOfficer.user.phone,
              designation: project.bankOfficer.designation,
            }
          : null,
        property: property
          ? {
              address: property.address,
              city: property.city,
              district: property.district,
              province: property.province,
              local_authority: property.local_authority,
              land_type: property.land_type,
              latitude: property.latitude,
              longitude: property.longitude,
            }
          : null,
        survey: survey
          ? {
              plan_number: survey.plan_number,
              surveyor_name: survey.surveyor_name,
              boundary_details: survey.boundary_details,
              lot_number: survey.lot_number,
              land_shape: survey.land_shape,
            }
          : null,
        legal: legal
          ? {
              deed_number: legal.deed_number,
              deed_type: legal.deed_type,
              registration_date: legal.registration_date,
              notary_details: legal.notary_details,
              ownership_type: legal.ownership_type,
              usage_regulations: legal.usage_regulations,
            }
          : null,
        documents: documents.map((d) => ({
          nic_file_name: d.nic_file_name,
          nic_file_path: d.nic_file_path,
          tax_file_name: d.tax_file_name,
          tax_file_path: d.tax_file_path,
          utility_file_name: d.utility_file_name,
          utility_file_path: d.utility_file_path,
          other_file_name: d.other_file_name,
          other_file_path: d.other_file_path,
          uploaded_at: d.uploaded_at,
        })),
      };
    } catch (error) {
      return { found: false, error: error?.message || 'Unknown error in project summary' };
    }
  }
}
