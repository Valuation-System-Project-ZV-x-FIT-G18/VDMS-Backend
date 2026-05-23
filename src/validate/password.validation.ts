import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export function IsValidPassword(label = 'Password') {
  return applyDecorators(
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsString({ message: `${label} must be a string` }),
    Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
      message:
        `${label} must contain at least 8 characters with letters, numbers, and symbols`,
    }),
  );
}
