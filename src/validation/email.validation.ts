import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { trimString } from './common';

export function IsValidEmailField(label = 'Email') {
  return applyDecorators(
    Transform(trimString),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsEmail({}, { message: `${label} must include @ and a dot` }),
  );
}
