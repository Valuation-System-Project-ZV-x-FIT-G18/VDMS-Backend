import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { hasText, trimString } from './common';

const normalizeDate = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

@ValidatorConstraint({ name: 'LegalRegistrationDateBeforeToday', async: false })
class LegalRegistrationDateBeforeTodayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown) {
    if (!hasText(value)) {
      return true;
    }

    const registrationDate = new Date(String(value));
    if (Number.isNaN(registrationDate.getTime())) {
      return true;
    }

    return normalizeDate(registrationDate) < normalizeDate(new Date());
  }

  defaultMessage() {
    return 'Registration date must be before today';
  }
}

export function IsValidLegalRegistrationDate(label = 'Registration date') {
  return applyDecorators(
    Transform(trimString),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsDateString({}, { message: `${label} must be a valid date` }),
    Validate(LegalRegistrationDateBeforeTodayConstraint),
  );
}
