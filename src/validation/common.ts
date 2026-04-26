import type { TransformFnParams } from 'class-transformer';

export interface FieldValidationOptions {
  optional?: boolean;
}

export const trimString = ({ value }: TransformFnParams) =>
  typeof value === 'string' ? value.trim() : value;

export const hasText = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0;
