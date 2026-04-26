import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { trimString } from './common';

export function IsValidBranch(label = 'Branch') {
  return applyDecorators(
    Transform(trimString),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsString({ message: `${label} must be a string` }),
  );
}
