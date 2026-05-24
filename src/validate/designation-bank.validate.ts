import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class DesignationBankValidateDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Designation can contain only letters and spaces',
  })
  designation!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Bank name can contain only letters and spaces',
  })
  bankName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Branch can contain only letters and spaces',
  })
  branch!: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @Matches(/^\d{3,5}$/, {
    message: 'Branch code must contain only digits and be 3 to 5 digits',
  })
  branchCode?: string;
}
