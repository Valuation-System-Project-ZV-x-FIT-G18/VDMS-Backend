import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnicalOfficerProject } from '../entities/technical-officer-project.entity';
import { TechnicalOfficerReport } from '../entities/technical-officer-report.entity';
import { ClarificationResponseDto } from './dto/clarification-response.dto';
import { CreateTechnicalOfficerReportDto } from './dto/create-technical-officer-report.dto';
import { RejectTechnicalOfficerReportDto } from './dto/reject-technical-officer-report.dto';
import { UpdateTechnicalOfficerReportDto } from './dto/update-technical-officer-report.dto';

// Contains report workflow logic and database access through TypeORM repositories.
@Injectable()
export class TechnicalOfficerReportsService {
  constructor(
    @InjectRepository(TechnicalOfficerReport)
    private readonly reportsRepository: Repository<TechnicalOfficerReport>,
    @InjectRepository(TechnicalOfficerProject)
    private readonly projectsRepository: Repository<TechnicalOfficerProject>,
  ) {}

  // Creates a draft report only after confirming the project exists.
  async create(createReportDto: CreateTechnicalOfficerReportDto) {
    await this.ensureProjectExists(createReportDto.projectId);

    const report = this.reportsRepository.create({
      ...createReportDto,
      status: createReportDto.status ?? 'Draft',
    });

    return this.reportsRepository.save(report);
  }

  // Reads all reports, newest first.
  async findAll() {
    return this.reportsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Reads reports for one project after validating the project id.
  async findByProject(projectId: string) {
    await this.ensureProjectExists(projectId);

    return this.reportsRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  // Updates editable report fields and validates project changes.
  async update(id: string, updateReportDto: UpdateTechnicalOfficerReportDto) {
    const report = await this.findOne(id);

    if (updateReportDto.projectId) {
      await this.ensureProjectExists(updateReportDto.projectId);
    }

    const updatedReport = this.reportsRepository.merge(report, updateReportDto);

    return this.reportsRepository.save(updatedReport);
  }

  // Moves a draft report into Pending Review state.
  async submit(id: string) {
    const report = await this.findOne(id);
    report.status = 'Pending Review';
    report.submittedAt = new Date();

    return this.reportsRepository.save(report);
  }

  // Stores reviewer rejection reason and marks the report as Rejected.
  async reject(id: string, rejectReportDto: RejectTechnicalOfficerReportDto) {
    const report = await this.findOne(id);
    report.rejectionReason = rejectReportDto.rejectionReason;
    report.status = 'Rejected';

    return this.reportsRepository.save(report);
  }

  // Stores clarification response and marks report as Resubmitted.
  async respondToClarification(
    id: string,
    clarificationResponseDto: ClarificationResponseDto,
  ) {
    const report = await this.findOne(id);
    report.clarificationResponse =
      clarificationResponseDto.clarificationResponse;
    report.status = 'Resubmitted';

    return this.reportsRepository.save(report);
  }

  // Shared helper for loading one report or returning a 404 error.
  private async findOne(id: string) {
    const report = await this.reportsRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Technical Officer report ${id} not found`);
    }

    return report;
  }

  // Prevents reports from being created for missing project ids.
  private async ensureProjectExists(projectId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Technical Officer project ${projectId} not found`,
      );
    }

    return project;
  }
}
