import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDefined,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { FileUploadValidateDto } from './common.validate';

export class DocumentUploadsValidateDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => FileUploadValidateDto)
  nicCopy!: FileUploadValidateDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Tax receipts can have up to 10 files only' })
  @ValidateNested({ each: true })
  @Type(() => FileUploadValidateDto)
  taxReceipts?: FileUploadValidateDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Utility bills can have up to 10 files only' })
  @ValidateNested({ each: true })
  @Type(() => FileUploadValidateDto)
  utilityBills?: FileUploadValidateDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Other documents can have up to 10 files only' })
  @ValidateNested({ each: true })
  @Type(() => FileUploadValidateDto)
  otherDocuments?: FileUploadValidateDto[];
}
