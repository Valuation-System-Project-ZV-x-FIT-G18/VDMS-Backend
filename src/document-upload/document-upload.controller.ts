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
import { extname } from 'path';
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
        { name: 'taxReceipts', maxCount: 1 },
        { name: 'utilityBills', maxCount: 1 },
        { name: 'otherDocs', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: 'uploads',
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
