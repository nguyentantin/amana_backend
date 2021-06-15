import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'userColor', async: false })
export class ColorValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const pattern = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        return pattern.test(value);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Color is in invalid';
    }
}
