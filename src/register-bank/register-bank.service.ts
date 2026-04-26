import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, QueryFailedError } from 'typeorm';
import { User } from '../entities/user.entity';
import { Bank } from '../entities/bank.entity';
import { BankOfficer } from '../entities/bank-officer.entity';
import { BankProjectOfficer } from '../entities/bank-project-officer.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { Project } from '../entities/project.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { UserRole } from '../enums/user-role.enum';
import { RegisterBankDto } from './dto/register-bank.dto';

@Injectable()
export class RegisterBankService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Bank) private readonly bankRepo: Repository<Bank>,
    @InjectRepository(BankOfficer)
    private readonly officerRepo: Repository<BankOfficer>,
    @InjectRepository(BankProjectOfficer)
    private readonly junctionRepo: Repository<BankProjectOfficer>,
    @InjectRepository(LoanApplicant)
    private readonly loanApplicantRepo: Repository<LoanApplicant>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectLoanApplicant)
    private readonly projectLoanApplicantRepo: Repository<ProjectLoanApplicant>,
  ) {}

  private async getNextBankId() {
    const rows = await this.bankRepo.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(bank_id FROM 4) AS INTEGER)), 0) + 1 AS next
       FROM banks
       WHERE bank_id ~ '^bnk[0-9]+$'`,
    );
    const next = Number(rows?.[0]?.next ?? 1);
    return `bnk${String(next).padStart(3, '0')}`;
  }

  private async getNextUserId() {
    const rows = await this.userRepo.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(user_id FROM 4) AS INTEGER)), 0) + 1 AS next
       FROM users
       WHERE user_id ~ '^usr[0-9]+$'`,
    );
    const next = Number(rows?.[0]?.next ?? 1);
    return `usr${String(next).padStart(3, '0')}`;
  }

  private async getNextOfficerId() {
    const rows = await this.officerRepo.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(officer_id FROM 4) AS INTEGER)), 0) + 1 AS next
       FROM bank_officers
       WHERE officer_id ~ '^bof[0-9]+$'`,
    );
    const next = Number(rows?.[0]?.next ?? 1);
    return `bof${String(next).padStart(3, '0')}`;
  }

  private async resolveTargetProjectId(applicantNic?: string): Promise<string | null> {
    const nic = String(applicantNic ?? '').trim();

    if (nic) {
      const applicantUser = await this.userRepo.findOne({
        where: { nic, role: UserRole.LOAN_APPLICANT },
      });

      if (applicantUser) {
        const loanApplicant = await this.loanApplicantRepo.findOne({
          where: { user: { user_id: applicantUser.user_id } },
          relations: ['user'],
        });

        if (loanApplicant) {
          const link = await this.projectLoanApplicantRepo
            .createQueryBuilder('projectLoanApplicant')
            .select('projectLoanApplicant.project_id', 'project_id')
            .where('projectLoanApplicant.loan_applicant_id = :loanApplicantId', {
              loanApplicantId: loanApplicant.loan_applicant_id,
            })
            .orderBy('projectLoanApplicant.id', 'DESC')
            .getRawOne<{ project_id: string }>();

          if (link?.project_id) return link.project_id;
        }

        const valuationProject = await this.projectLoanApplicantRepo.query(
          `
          SELECT vp.project_id
          FROM valuation_projects vp
          WHERE vp.user_id = $1
          ORDER BY vp.project_id DESC
          LIMIT 1
          `,
          [applicantUser.user_id],
        );

        if (valuationProject.length > 0) return valuationProject[0].project_id;
      }
    }

    const latestLoanApplicantProject = await this.projectLoanApplicantRepo
      .createQueryBuilder('projectLoanApplicant')
      .select('projectLoanApplicant.project_id', 'project_id')
      .orderBy('projectLoanApplicant.id', 'DESC')
      .getRawOne<{ project_id: string }>();

    if (latestLoanApplicantProject?.project_id) return latestLoanApplicantProject.project_id;

    const latestValuationProject = await this.projectLoanApplicantRepo.query(
      `
      SELECT vp.project_id
      FROM valuation_projects vp
      ORDER BY vp.project_id DESC
      LIMIT 1
      `,
    );

    if (latestValuationProject.length > 0) return latestValuationProject[0].project_id;

    const latestProject = await this.projectRepo
      .createQueryBuilder('project')
      .select('project.project_id', 'project_id')
      .orderBy('project.created_at', 'DESC')
      .getRawOne<{ project_id: string }>();

    return latestProject?.project_id ?? null;
  }

  async register(dto: RegisterBankDto) {
    try {
      const existingUser = await this.userRepo.findOne({
        where: [{ nic: dto.nic }, { email: dto.email }],
      });
      if (existingUser) {
        if (existingUser.role !== UserRole.BANK) {
          throw new ConflictException(
            'A user with this NIC or email already exists',
          );
        }

        const existingOfficer = await this.officerRepo.findOne({
          where: { user: { user_id: existingUser.user_id } },
          relations: ['user'],
        });

        const existingBankLink = existingOfficer
          ? await this.junctionRepo
              .createQueryBuilder('bankProjectOfficer')
              .select('bankProjectOfficer.bank_id', 'bank_id')
              .where('bankProjectOfficer.officer_id = :officerId', {
                officerId: existingOfficer.officer_id,
              })
              .orderBy('bankProjectOfficer.id', 'DESC')
              .getRawOne<{ bank_id: string }>()
          : null;

        let bankId = existingBankLink?.bank_id ?? null;
        if (!bankId) {
          const existingBank = await this.bankRepo.findOne({
            where: {
              bank_name: dto.bankName,
              branch: dto.branch,
              branch_code: dto.branchCode,
            },
          });

          if (existingBank) {
            bankId = existingBank.bank_id;
          } else {
            const createdBank = this.bankRepo.create({
              bank_id: await this.getNextBankId(),
              bank_name: dto.bankName,
              branch: dto.branch,
              branch_code: dto.branchCode,
            });
            await this.bankRepo.save(createdBank);
            bankId = createdBank.bank_id;
          }
        }

        const targetProjectId = await this.resolveTargetProjectId(dto.applicantNic);

        if (existingOfficer && bankId && targetProjectId) {
          const link = await this.junctionRepo.query(
            `
            SELECT id
            FROM bank_project_officer
            WHERE project_id = $1 AND officer_id = $2
            ORDER BY id DESC
            LIMIT 1
            `,
            [targetProjectId, existingOfficer.officer_id],
          );

          if (link.length === 0) {
            await this.junctionRepo.query(
              'INSERT INTO bank_project_officer (bank_id, project_id, officer_id) VALUES ($1, $2, $3)',
              [bankId, targetProjectId, existingOfficer.officer_id],
            );
          }
        }

        return {
          success: true,
          userId: existingUser.user_id,
          officerId: existingOfficer?.officer_id ?? null,
          bankId,
          message: 'Bank officer already exists',
        };
      }

      /* 1. Create bank record — bank_name, branch, branch_code */
      const bankData: DeepPartial<Bank> = {
        bank_id: await this.getNextBankId(),
        bank_name: dto.bankName,
        branch: dto.branch,
        branch_code: dto.branchCode,
      };
      const bank = this.bankRepo.create(bankData);
      await this.bankRepo.save(bank); // save to banks table

      /* 2. Create user record for the bank officer */
      const userId = await this.getNextUserId();
      const userData: DeepPartial<User> = {
        user_id: userId,
        nic: dto.nic,
        email: dto.email,
        password: 'temp-password', // officers get password later
        role: UserRole.BANK,
        full_name: dto.fullName,
        first_name: dto.firstName,
        last_name: dto.lastName,
        name_with_initials: dto.nameWithInitials,
        phone: dto.phone,
        street_address: '',
        city: '',
        district: '',
        province: '',
      };
      const user = this.userRepo.create(userData);
      await this.userRepo.save(user); // save to users table

      /* 3. Create bank officer record — user_id FK + designation */
      const officerId = await this.getNextOfficerId();
      const officerData: DeepPartial<BankOfficer> = {
        officer_id: officerId,
        user,
        designation: dto.designation || undefined,
      };
      const officer = this.officerRepo.create(officerData);
      await this.officerRepo.save(officer); // save to bank_officers table

      /* 4. Resolve target project id from applicant linkage in merged schema */
      const targetProjectId = await this.resolveTargetProjectId(dto.applicantNic);

      /* 5. Fill junction table — bank_id, project_id, officer_id */
      if (targetProjectId) {
        await this.junctionRepo.query(
          'INSERT INTO bank_project_officer (bank_id, project_id, officer_id) VALUES ($1, $2, $3)',
          [bank.bank_id, targetProjectId, officer.officer_id],
        );
      }

      return { success: true, userId, officerId, bankId: bank.bank_id };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        const driverError = (error as QueryFailedError & { driverError?: { code?: string } }).driverError;
        if (driverError?.code === '23505') {
          throw new ConflictException('A duplicate record already exists for this registration');
        }
      }

      throw error;
    }
  }
}
