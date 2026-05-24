import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { FieldValidationOptions, hasText, trimString } from './common';

export function IsValidProjectId(
  label = 'Project id',
  options: FieldValidationOptions = {},
) {
  return applyDecorators(
    Transform(trimString),
    ...(options.optional
      ? [ValidateIf((_object, value) => hasText(value))]
      : [IsNotEmpty({ message: `${label} cannot be empty` })]),
    IsString({ message: `${label} must be a string` }),
    Matches(/^pro\d{3}$/, {
      message: `${label} must begin with pro followed by 3 digits`,
    }),
  );
}
