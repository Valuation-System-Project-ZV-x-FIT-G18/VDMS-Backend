import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentUpload } from '../entities/document-upload.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { Project } from '../entities/project.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { User } from '../entities/user.entity';
import { DocumentUploadDto } from './dto/document-upload.dto';

type UploadedFile = { filename?: string; originalname: string };

@Injectable()
export class DocumentUploadService {
  constructor(
    @InjectRepository(DocumentUpload)
    private readonly repo: Repository<DocumentUpload>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LoanApplicant)
    private readonly loanApplicantRepo: Repository<LoanApplicant>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectLoanApplicant)
    private readonly projectLoanApplicantRepo: Repository<ProjectLoanApplicant>,
  ) {}

  private async getNextProjectId() {
    const rows = await this.projectRepo.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(project_id FROM 4) AS INTEGER)), 0) + 1 AS next
       FROM valuation_projects
       WHERE project_id ~ '^pro[0-9]+$'`,
    );
    const next = Number(rows?.[0]?.next ?? 1);
    return `pro${String(next).padStart(3, '0')}`;
  }

  private parseListValue(value?: string): string[] {
    if (!value) return [];

    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(String).filter(Boolean);
        }
      } catch {
        // keep legacy fallback behavior
      }
    }

    if (trimmed.includes('||')) {
      return trimmed.split('||').map((part) => part.trim()).filter(Boolean);
    }

    return [value];
  }

  private resolveMultiField(
    uploaded: UploadedFile[] | undefined,
    dtoNames: string | undefined,
    dtoPaths: string | undefined,
    existingNames: string | undefined,
    existingPaths: string | undefined,
    toUrl: (file?: UploadedFile) => string | undefined,
  ): { names?: string; paths?: string } {
    if (uploaded && uploaded.length > 0) {
      const names = uploaded.map((f) => f.originalname);
      const paths = uploaded.map((f) => toUrl(f) ?? f.originalname);
      return {
        names: JSON.stringify(names),
        paths: JSON.stringify(paths),
      };
    }

    if (dtoNames || dtoPaths) {
      const names = this.parseListValue(dtoNames);
      const paths = this.parseListValue(dtoPaths);
      return {
        names: names.length ? JSON.stringify(names) : undefined,
        paths: paths.length ? JSON.stringify(paths) : undefined,
      };
    }

    return { names: existingNames, paths: existingPaths };
  }

  async save(
    dto: DocumentUploadDto,
    files: { [field: string]: UploadedFile[] },
  ) {
    const nic = dto.nic?.trim();
    if (!nic) {
      throw new BadRequestException('NIC is required to save documents');
    }

    const user = await this.userRepo.findOne({ where: { nic } });
    if (!user) {
      throw new NotFoundException(
        'No registered client found for the provided NIC',
      );
    }

    const existing = await this.repo.findOne({
      where: { user: { user_id: user.user_id } },
      relations: ['user'],
    });
    const base = process.env.PUBLIC_API_BASE || 'http://localhost:3000';
    const url = (f?: UploadedFile) =>
      f?.filename ? `${base}/uploads/${f.filename}` : undefined;
    const nicFile = files?.nicCopy?.[0];
    const taxFiles = files?.taxReceipts;
    const utilityFiles = files?.utilityBills;
    const otherFiles = files?.otherDocs;
    const taxMulti = this.resolveMultiField(
      taxFiles,
      dto.taxFileName,
      dto.taxFilePath,
      existing?.tax_file_name,
      existing?.tax_file_path,
      url,
    );
    const utilityMulti = this.resolveMultiField(
      utilityFiles,
      dto.utilityFileName,
      dto.utilityFilePath,
      existing?.utility_file_name,
      existing?.utility_file_path,
      url,
    );
    const otherMulti = this.resolveMultiField(
      otherFiles,
      dto.otherFileName,
      dto.otherFilePath,
      existing?.other_file_name,
      existing?.other_file_path,
      url,
    );
    const data = {
      nic_file_name:
        nicFile?.originalname ?? dto.nicFileName ?? existing?.nic_file_name,
      nic_file_path: url(nicFile) ?? dto.nicFilePath ?? existing?.nic_file_path,
      tax_file_name: taxMulti.names,
      tax_file_path: taxMulti.paths,
      utility_file_name: utilityMulti.names,
      utility_file_path: utilityMulti.paths,
      other_file_name: otherMulti.names,
      other_file_path: otherMulti.paths,
      user,
    };

    let documentId = existing?.document_id;
    if (existing) await this.repo.save(this.repo.merge(existing, data));
    else {
      const count = await this.repo.count();
      documentId = `doc${String(count + 1).padStart(3, '0')}`;
      await this.repo.save(
        this.repo.create({ document_id: documentId, ...data }),
      );
    }

    const loanApplicant = await this.loanApplicantRepo.findOne({
      where: { user: { user_id: user.user_id } },
      relations: ['user'],
    });

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
      projectId = await this.getNextProjectId();

      await this.projectRepo.query(
        `INSERT INTO valuation_projects (project_id, status, user_id)
         VALUES ($1, $2, $3)`,
        [
          projectId,
          'pending',
          user.user_id,
        ],
      );

      if (loanApplicant) {
        await this.projectLoanApplicantRepo.query(
          `INSERT INTO project_loan_applicant (project_id, loan_applicant_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [projectId, loanApplicant.loan_applicant_id],
        );
      }
    }

    return { success: true, documentId, projectId };
  }

  async getByNic(nic: string) {
    const user = await this.userRepo.findOne({ where: { nic } });
    if (!user) return null;

    return this.repo.findOne({
      where: { user: { user_id: user.user_id } },
      relations: ['user'],
      order: { uploaded_at: 'DESC' },
    });
  }
}
