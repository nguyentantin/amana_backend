import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { AuthService } from '../../auth/auth.service';
import { BcryptHash } from '../../../helpers';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';

@ValidatorConstraint()
export class CurrentPasswordValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        // @ts-ignore
        const { password } = validationArguments.object;

        if (isUndefined(password)) {
            throw new UnprocessableEntityException({
                password: ['password is required'],
            });
        }

        const user = AuthService.getAuthUser();

        return BcryptHash.compareHash(value, user.password);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Current password is invalid';
    }
}
