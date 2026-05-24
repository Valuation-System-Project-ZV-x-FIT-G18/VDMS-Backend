import { Controller, Get, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { ProjectIdQueryDto } from '../../validate';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // GET /documents?projectId=xxx
  @Get()
  findByProject(@Query() query: ProjectIdQueryDto) {
    return this.documentsService.findByProject(query.projectId);
  }

  // GET /documents/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }
}
