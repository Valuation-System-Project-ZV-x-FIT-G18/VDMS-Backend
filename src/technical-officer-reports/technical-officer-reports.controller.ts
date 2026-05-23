import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ClarificationResponseDto } from './dto/clarification-response.dto';
import { CreateTechnicalOfficerReportDto } from './dto/create-technical-officer-report.dto';
import { RejectTechnicalOfficerReportDto } from './dto/reject-technical-officer-report.dto';
import { UpdateTechnicalOfficerReportDto } from './dto/update-technical-officer-report.dto';
import { TechnicalOfficerReportsService } from './technical-officer-reports.service';

@Controller('technical-officer/reports')
export class TechnicalOfficerReportsController {
  constructor(
    private readonly reportsService: TechnicalOfficerReportsService,
  ) {}

  @Post()
  create(@Body() createReportDto: CreateTechnicalOfficerReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.reportsService.findByProject(projectId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateTechnicalOfficerReportDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Patch(':id/submit')
  submit(@Param('id') id: string) {
    return this.reportsService.submit(id);
  }

  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() rejectReportDto: RejectTechnicalOfficerReportDto,
  ) {
    return this.reportsService.reject(id, rejectReportDto);
  }

  @Patch(':id/clarification-response')
  respondToClarification(
    @Param('id') id: string,
    @Body() clarificationResponseDto: ClarificationResponseDto,
  ) {
    return this.reportsService.respondToClarification(
      id,
      clarificationResponseDto,
    );
  }
}
