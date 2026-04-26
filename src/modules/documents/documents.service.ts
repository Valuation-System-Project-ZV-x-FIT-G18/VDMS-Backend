import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../../entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  // Get all documents for a project
  async findByProject(projectId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { projectId },
      order: { uploadDate: 'DESC' },
    });
  }

  // Get single document
  async findOne(id: string): Promise<Document | null> {
    return this.documentRepository.findOne({ where: { id } });
  }

  // Update document status (when uploaded)
  async updateStatus(
    id: string,
    status: DocumentStatus,
    uploadedBy?: string,
    fileUrl?: string,
  ): Promise<Document | null> {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (document) {
      document.status = status;
      if (uploadedBy) document.uploadedBy = uploadedBy;
      if (fileUrl) document.fileUrl = fileUrl;
      return this.documentRepository.save(document);
    }

    return null;
  }
}
