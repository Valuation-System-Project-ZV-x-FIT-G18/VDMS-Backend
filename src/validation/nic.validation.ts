import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { FieldValidationOptions, hasText, trimString } from './common';

export function IsValidNic(
  label = 'NIC',
  options: FieldValidationOptions = {},
) {
  return applyDecorators(
    Transform(trimString),
    ...(options.optional
      ? [ValidateIf((_object, value) => hasText(value))]
      : [IsNotEmpty({ message: `${label} cannot be empty` })]),
    IsString({ message: `${label} must be a string` }),
    Matches(/^(\d{12}|\d{9}[Vv])$/, {
      message: `${label} must be 12 digits or 9 digits with V letter`,
    }),
  );
}
