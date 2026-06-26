import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { trimString } from './common';

export function IsValidContactNumber(label = 'Contact number') {
  return applyDecorators(
    Transform(trimString),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsString({ message: `${label} must be a string` }),
    Matches(/^(0\d{9}|[1-9]\d{8})$/, {
      message:
        `${label} must be 10 digits beginning with 0 or 9 digits not beginning with 0`,
    }),
  );
}
