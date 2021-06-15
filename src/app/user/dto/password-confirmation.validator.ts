import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { UnprocessableEntityException } from '@nestjs/common';

@ValidatorConstraint()
export class PasswordConfirmationValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        // @ts-ignore
        const { password } = validationArguments.object;

        if (isUndefined(password)) {
            throw new UnprocessableEntityException({
                password: ['password is required'],
            });
        }

        return value === password;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Password confirmation failed';
    }
}
