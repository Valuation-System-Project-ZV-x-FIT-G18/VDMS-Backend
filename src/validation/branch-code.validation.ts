import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { trimString } from './common';

export function IsValidBranchCode(label = 'Branch code') {
  return applyDecorators(
    Transform(trimString),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsString({ message: `${label} must be a string` }),
    Matches(/^\d+$/, {
      message: `${label} can only contain digits`,
    }),
  );
}
