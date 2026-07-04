import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Datasheet } from '../../entities/datasheet.entity';
import { StorageService } from '../../storage/storage.service';
import { UploadDatasheetDto } from './dto/upload-datasheet.dto';
import { UploadedMulterFile } from './uploaded-file.type';

@Injectable()
export class DatasheetsService {
  constructor(
    @InjectRepository(Datasheet)
    private readonly datasheetRepository: Repository<Datasheet>,
    private readonly storageService: StorageService,
  ) {}

  async upload(
    dto: UploadDatasheetDto,
    file?: UploadedMulterFile,
  ): Promise<Datasheet> {
    if (!file) {
      throw new BadRequestException('No file provided (expected field "file").');
    }

    const stored = await this.storageService.upload({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: 'datasheets',
    });

    const datasheet = this.datasheetRepository.create({
      projectId: dto.projectId,
      projectCode: dto.projectCode ?? null,
      fileName: file.originalname,
      fileUrl: stored.url,
      storageKey: stored.key,
      storageProvider: stored.provider,
      mimeType: file.mimetype ?? null,
      fileSize: stored.size,
      uploadedBy: dto.uploadedBy ?? null,
    });

    return this.datasheetRepository.save(datasheet);
  }

  findByProject(projectId: string): Promise<Datasheet[]> {
    return this.datasheetRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }
}
