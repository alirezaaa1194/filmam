import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { appLanguages } from '../../lib/utils';

@ValidatorConstraint({ name: 'RequiredTranslations', async: false })
export class RequiredTranslationsConstraint implements ValidatorConstraintInterface {
  validate(translations: any[]) {
    if (!Array.isArray(translations)) {
      return false;
    }

    if (translations.length !== 3) {
      return false;
    }

    const languages = translations.map((t) => t.language);

    const missingLanguages = appLanguages.filter(
      (f) => !languages.includes(f.language),
    );

    return missingLanguages.length === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Translations must contain FA, EN and AR.';
  }
}

export function RequiredTranslations(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: RequiredTranslationsConstraint,
    });
  };
}
