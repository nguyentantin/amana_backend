import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
    validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
        const date = new Date(value);
        return !isNaN(date.getTime());
    }

    defaultMessage(args?: ValidationArguments): string {
        return `${args.property} is not valid date`;
    }
}

export function IsValidDate(
    constraints?: any[],
    validationOptions?: ValidationOptions,
) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints,
            validator: IsValidDateConstraint,
        });
    };
}
