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
    const taxFile = files?.taxReceipts?.[0];
    const utilityFile = files?.utilityBills?.[0];
    const otherFile = files?.otherDocs?.[0];
    const data = {
      nic_file_name:
        nicFile?.originalname ?? dto.nicFileName ?? existing?.nic_file_name,
      nic_file_path: url(nicFile) ?? dto.nicFilePath ?? existing?.nic_file_path,
      tax_file_name:
        taxFile?.originalname ?? dto.taxFileName ?? existing?.tax_file_name,
      tax_file_path: url(taxFile) ?? dto.taxFilePath ?? existing?.tax_file_path,
      utility_file_name:
        utilityFile?.originalname ??
        dto.utilityFileName ??
        existing?.utility_file_name,
      utility_file_path:
        url(utilityFile) ?? dto.utilityFilePath ?? existing?.utility_file_path,
      other_file_name:
        otherFile?.originalname ??
        dto.otherFileName ??
        existing?.other_file_name,
      other_file_path:
        url(otherFile) ?? dto.otherFilePath ?? existing?.other_file_path,
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
