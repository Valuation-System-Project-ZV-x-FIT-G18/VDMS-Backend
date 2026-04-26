import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

function MatchesField(property: string, label: string) {
  return (target: object, propertyName: string) => {
    registerDecorator({
      name: 'matchesField',
      target: target.constructor,
      propertyName,
      constraints: [property, label],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return value === (args.object as Record<string, unknown>)[relatedPropertyName];
        },
        defaultMessage(args: ValidationArguments) {
          const [, relatedLabel] = args.constraints;
          return `${args.property} must match ${relatedLabel}`;
        },
      },
    });
  };
}

export function IsValidConfirmPassword(label = 'Confirm password') {
  return applyDecorators(
    IsNotEmpty({ message: `${label} cannot be empty` }),
    IsString({ message: `${label} must be a string` }),
    MatchesField('password', 'password'),
  );
}
