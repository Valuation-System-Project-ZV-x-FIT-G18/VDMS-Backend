import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { trimString } from './common';

export function IsValidFullName(label = 'Full name') {
  return applyDecorators(
    Transform(trimString),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsString({ message: `${label} must be a string` }),
    Matches(/^[A-Za-z\s]+$/, {
      message: `${label} can only contain letters`,
    }),
  );
}
