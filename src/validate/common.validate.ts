import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export const ALLOWED_DOC_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];

const toDate = (value: unknown) => new Date(String(value));

@ValidatorConstraint({ name: 'NotFutureDate', async: false })
class NotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const parsed = toDate(value);
    if (Number.isNaN(parsed.getTime())) {
      return false;
    }

    const today = new Date();
    const parsedDateOnly = new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate(),
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return parsedDateOnly <= todayOnly;
  }
}

@ValidatorConstraint({ name: 'MinAge', async: false })
class MinAgeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const minAge = (args.constraints?.[0] as number) ?? 18;
    const birthDate = toDate(value);
    if (Number.isNaN(birthDate.getTime())) {
      return false;
    }

    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthOffset = now.getMonth() - birthDate.getMonth();

    if (
      monthOffset < 0 ||
      (monthOffset === 0 && now.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }

    return age >= minAge;
  }

  defaultMessage(args: ValidationArguments) {
    const minAge = (args.constraints?.[0] as number) ?? 18;
    return `Age must be at least ${minAge}`;
  }
}

@ValidatorConstraint({ name: 'FutureDateTime', async: false })
class FutureDateTimeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const parsed = toDate(value);
    if (Number.isNaN(parsed.getTime())) {
      return false;
    }

    return parsed.getTime() > Date.now();
  }
}

@ValidatorConstraint({ name: 'WorkingHours', async: false })
class WorkingHoursConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const parsed = toDate(value);
    if (Number.isNaN(parsed.getTime())) {
      return false;
    }

    const hours = parsed.getHours();
    return hours >= 8 && hours < 17;
  }
}

@ValidatorConstraint({ name: 'MeaningfulWordCount', async: false })
class MeaningfulWordCountConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    const minWords = (args.constraints?.[0] as number) ?? 2;
    const maxWords = (args.constraints?.[1] as number) ?? 150;
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => /[A-Za-z]/.test(word));

    if (words.length < minWords || words.length > maxWords) {
      return false;
    }

    return words.join(' ').replace(/[^A-Za-z]/g, '').length >= 6;
  }

  defaultMessage(args: ValidationArguments) {
    const minWords = (args.constraints?.[0] as number) ?? 2;
    const maxWords = (args.constraints?.[1] as number) ?? 150;
    return `Text must contain meaningful content with ${minWords}-${maxWords} words`;
  }
}

@ValidatorConstraint({ name: 'AllowedMimeType', async: false })
class AllowedMimeTypeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    const allowed = (args.constraints?.[0] as string[]) ?? ALLOWED_DOC_MIME_TYPES;
    return allowed.includes(value.toLowerCase());
  }
}

@ValidatorConstraint({ name: 'MaxFileSizeMb', async: false })
class MaxFileSizeMbConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return false;
    }

    const maxMb = (args.constraints?.[0] as number) ?? 10;
    return value > 0 && value <= maxMb;
  }

  defaultMessage(args: ValidationArguments) {
    const maxMb = (args.constraints?.[0] as number) ?? 10;
    return `File size must be ${maxMb} MB or less`;
  }
}

@ValidatorConstraint({ name: 'MatchField', async: false })
class MatchFieldConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const [property] = args.constraints as [string];
    const target = args.object as Record<string, unknown>;
    return value === target?.[property];
  }

  defaultMessage(args: ValidationArguments) {
    const [property] = args.constraints as [string];
    return `${args.property} must match ${property}`;
  }
}

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return Validate(NotFutureDateConstraint, [], validationOptions);
}

export function IsMinAge(minAge = 18, validationOptions?: ValidationOptions) {
  return Validate(MinAgeConstraint, [minAge], validationOptions);
}

export function IsFutureDateTime(validationOptions?: ValidationOptions) {
  return Validate(FutureDateTimeConstraint, [], validationOptions);
}

export function IsWithinWorkingHours(validationOptions?: ValidationOptions) {
  return Validate(WorkingHoursConstraint, [], validationOptions);
}

export function IsMeaningfulTextWords(
  minWords = 2,
  maxWords = 150,
  validationOptions?: ValidationOptions,
) {
  return Validate(
    MeaningfulWordCountConstraint,
    [minWords, maxWords],
    validationOptions,
  );
}

export function IsAllowedMimeType(
  allowedMimeTypes = ALLOWED_DOC_MIME_TYPES,
  validationOptions?: ValidationOptions,
) {
  return Validate(AllowedMimeTypeConstraint, [allowedMimeTypes], validationOptions);
}

export function IsMaxFileSizeMb(maxMb = 10, validationOptions?: ValidationOptions) {
  return Validate(MaxFileSizeMbConstraint, [maxMb], validationOptions);
}

export function MatchField(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'MatchField',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: MatchFieldConstraint,
    });
  };
}

export class FileUploadValidateDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  @IsAllowedMimeType(ALLOWED_DOC_MIME_TYPES, {
    message: 'File must be PDF or image format',
  })
  mimeType!: string;

  @Type(() => Number)
  @IsNumber()
  @IsMaxFileSizeMb(10)
  sizeInMb!: number;
}
