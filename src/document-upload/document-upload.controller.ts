import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads');
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
import { DocumentUploadService } from './document-upload.service';
import { DocumentUploadDto } from './dto/document-upload.dto';

type UploadedFile = { filename?: string; originalname: string };

const editFileName = (
  _: unknown,
  file: UploadedFile,
  cb: (error: Error | null, filename: string) => void,
) => {
  const stamp = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  cb(null, `${stamp}${extname(file.originalname)}`);
};

@Controller('document-upload') // POST /document-upload
export class DocumentUploadController {
  constructor(private readonly service: DocumentUploadService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'nicCopy', maxCount: 1 },
        { name: 'taxReceipts', maxCount: 10 },
        { name: 'utilityBills', maxCount: 10 },
        { name: 'otherDocs', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: UPLOADS_DIR,
          filename: editFileName,
        }),
      },
    ),
  )
  save(
    @Body() dto: DocumentUploadDto,
    @UploadedFiles() files: { [field: string]: UploadedFile[] },
  ) {
    return this.service.save(dto, files); // delegate to service
  }

  @Get()
  async getByNic(@Query('nic') nic: string) {
    return this.service.getByNic(nic);
  }
}
