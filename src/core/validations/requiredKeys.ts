import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { UnprocessableEntityException } from '@nestjs/common';

@ValidatorConstraint()
export class RequiredKeys implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const requiredKeys = validationArguments.constraints;
        const obj = validationArguments.object;
        const message = {};
        let invalid = false;

        for (const key of requiredKeys) {
            if (isUndefined(obj[key])) {
                message[key] = [`${key} is required`];
                invalid = true;
            }
        }

        if (invalid) {
            throw new UnprocessableEntityException(message);
        }

        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'unprocessable entity';
    }
}
