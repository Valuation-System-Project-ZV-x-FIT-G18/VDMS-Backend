import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DraftReportsService } from './draft-reports.service';

@Controller('draft-reports')
export class DraftReportsController {
  constructor(private draftReportsService: DraftReportsService) {}

  @Get()
  findAll() {
    return this.draftReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.draftReportsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.draftReportsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.draftReportsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.draftReportsService.remove(id);
  }
}