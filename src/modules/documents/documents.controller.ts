import { Controller, Get, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // GET /documents?projectId=xxx
  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.documentsService.findByProject(projectId);
  }

  // GET /documents/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }
}
