import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClarificationResponseDto } from './dto/clarification-response.dto';
import { CreateTechnicalOfficerReportDto } from './dto/create-technical-officer-report.dto';
import { RejectTechnicalOfficerReportDto } from './dto/reject-technical-officer-report.dto';
import { UpdateTechnicalOfficerReportDto } from './dto/update-technical-officer-report.dto';
import { TechnicalOfficerReportsService } from './technical-officer-reports.service';

// Handles API routes for draft reports, submissions, rejections, and clarifications.
@Controller('technical-officer/reports')
export class TechnicalOfficerReportsController {
  constructor(
    private readonly reportsService: TechnicalOfficerReportsService,
  ) {}

  // POST /technical-officer/reports - create a draft report.
  @Post()
  create(@Body() createReportDto: CreateTechnicalOfficerReportDto) {
    return this.reportsService.create(createReportDto);
  }

  // GET /technical-officer/reports - return all reports.
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  // GET /technical-officer/reports/project/:projectId - return reports for one project.
  @Get('project/:projectId')
  findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.reportsService.findByProject(projectId);
  }

  // PATCH /technical-officer/reports/:id - update report fields.
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReportDto: UpdateTechnicalOfficerReportDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  // PATCH /technical-officer/reports/:id/submit - submit draft for manager review.
  @Patch(':id/submit')
  submit(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.submit(id);
  }

  // PATCH /technical-officer/reports/:id/reject - store rejection reason.
  @Patch(':id/reject')
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rejectReportDto: RejectTechnicalOfficerReportDto,
  ) {
    return this.reportsService.reject(id, rejectReportDto);
  }

  // PATCH /technical-officer/reports/:id/clarification-response - send officer response.
  @Patch(':id/clarification-response')
  respondToClarification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() clarificationResponseDto: ClarificationResponseDto,
  ) {
    return this.reportsService.respondToClarification(
      id,
      clarificationResponseDto,
    );
  }
}
