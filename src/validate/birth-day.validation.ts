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

@ValidatorConstraint({ name: 'BirthDayNotFuture', async: false })
class BirthDayNotFutureConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (!hasText(value)) {
      return true;
    }

    const birthDay = new Date(String(value));
    if (Number.isNaN(birthDay.getTime())) {
      return true;
    }

    return normalizeDate(birthDay) <= normalizeDate(new Date());
  }

  defaultMessage() {
    return 'Birth day cannot be a future date';
  }
}

@ValidatorConstraint({ name: 'BirthDayAdult', async: false })
class BirthDayAdultConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (!hasText(value)) {
      return true;
    }

    const birthDay = new Date(String(value));
    if (Number.isNaN(birthDay.getTime())) {
      return true;
    }

    const today = normalizeDate(new Date());
    const adultDate = new Date(
      birthDay.getFullYear() + 18,
      birthDay.getMonth(),
      birthDay.getDate(),
    );

    return normalizeDate(adultDate) <= today;
  }

  defaultMessage() {
    return 'Birth day must be 18 years or older';
  }
}

export function IsValidBirthDay(label = 'Birth day') {
  return applyDecorators(
    Transform(trimString),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsDateString({}, { message: `${label} must be a valid date` }),
    Validate(BirthDayNotFutureConstraint),
    Validate(BirthDayAdultConstraint),
  );
}
