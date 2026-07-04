import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DatasheetsService } from './datasheets.service';
import { UploadDatasheetDto } from './dto/upload-datasheet.dto';
import type { UploadedMulterFile } from './uploaded-file.type';

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

@Controller('datasheets')
export class DatasheetsController {
  constructor(private readonly datasheetsService: DatasheetsService) {}

  // POST /api/datasheets  (multipart/form-data: file, projectId, projectCode?, uploadedBy?)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // Keep the bytes in memory so the StorageProvider decides where they go,
      // rather than letting multer commit them straight to disk.
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_BYTES },
    }),
  )
  upload(
    @Body() dto: UploadDatasheetDto,
    @UploadedFile() file: UploadedMulterFile,
  ) {
    return this.datasheetsService.upload(dto, file);
  }

  // GET /api/datasheets?projectId=xxx
  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.datasheetsService.findByProject(projectId);
  }
}
