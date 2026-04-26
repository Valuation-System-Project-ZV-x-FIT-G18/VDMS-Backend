import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { BankOfficer } from '../entities/bank-officer.entity';
import { BankProjectOfficer } from '../entities/bank-project-officer.entity';
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
    @InjectRepository(BankProjectOfficer)
    private readonly bpoRepo: Repository<BankProjectOfficer>,
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
    const user = await this.userRepo.findOne({ where: { nic } }); // find user by NIC
    if (!user) return { found: false }; // not found → early exit

    const loanApplicant = await this.loanRepo.findOne({
      where: { user: { user_id: user.user_id } },
      relations: ['user'],
    });

    let projectId: string | null = null;

    const valuationRows = await this.junctionRepo.query(
      `
      SELECT vp.project_id
      FROM valuation_projects vp
      WHERE vp.user_id = $1
      ORDER BY vp.project_id DESC
      LIMIT 1
      `,
      [user.user_id],
    );

    if (valuationRows.length > 0) {
      projectId = valuationRows[0].project_id;
    }

    if (!projectId && loanApplicant) {
      const junctionRows = await this.junctionRepo.query(
        `
        SELECT pla.project_id
        FROM project_loan_applicant pla
        WHERE pla.loan_applicant_id = $1
        ORDER BY pla.project_id DESC
        LIMIT 1
        `,
        [loanApplicant.loan_applicant_id],
      );

      if (junctionRows.length > 0) {
        projectId = junctionRows[0].project_id;
      }
    }

    let resolvedBpo: BankProjectOfficer | null = null;
    if (projectId) {
      const bpoRows = await this.bpoRepo.query(
        `
        SELECT id
        FROM bank_project_officer
        WHERE project_id = $1
        ORDER BY id DESC
        LIMIT 1
        `,
        [projectId],
      );

      if (bpoRows.length > 0) {
        resolvedBpo = await this.bpoRepo.findOne({
          where: { id: bpoRows[0].id },
          relations: ['bank', 'officer', 'officer.user'],
        });
      }
    }

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
        // client details from user
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
      bank: resolvedBpo?.bank
        ? {
            // bank info from junction
            bank_name: resolvedBpo.bank.bank_name,
            branch: resolvedBpo.bank.branch, // branch stored on bank
            branch_code: resolvedBpo.bank.branch_code, // branch code stored on bank
          }
        : null,
      bankOfficer: resolvedBpo?.officer
        ? {
            // bank officer info
            name: resolvedBpo.officer.user?.full_name,
            email: resolvedBpo.officer.user?.email,
            phone: resolvedBpo.officer.user?.phone,
            designation: resolvedBpo.officer.designation,
          }
        : null,
      property: property
        ? {
            // property info
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
            // survey plan info
            plan_number: survey.plan_number,
            surveyor_name: survey.surveyor_name,
            boundary_details: survey.boundary_details,
            lot_number: survey.lot_number,
            land_shape: survey.land_shape,
          }
        : null,
      legal: legal
        ? {
            // legal details
            deed_number: legal.deed_number,
            deed_type: legal.deed_type,
            registration_date: legal.registration_date,
            notary_details: legal.notary_details,
            ownership_type: legal.ownership_type,
            usage_regulations: legal.usage_regulations,
          }
        : null,
      documents: documents.map((d) => ({
        // uploaded documents
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
  }
}
