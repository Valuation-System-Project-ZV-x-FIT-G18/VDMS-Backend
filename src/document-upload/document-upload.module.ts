import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentUpload } from '../entities/document-upload.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { Project } from '../entities/project.entity';
import { ProjectLoanApplicant } from '../entities/project-loan-applicant.entity';
import { User } from '../entities/user.entity';
import { DocumentUploadController } from './document-upload.controller';
import { DocumentUploadService } from './document-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentUpload,
      User,
      Project,
      LoanApplicant,
      ProjectLoanApplicant,
    ]),
  ],
  controllers: [DocumentUploadController],
  providers: [DocumentUploadService],
})
export class DocumentUploadModule {}
