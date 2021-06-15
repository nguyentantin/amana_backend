import {
    registerDecorator, ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { UniqueValidationArguments } from './unique';
import { EntitySchema, getRepository, ObjectType } from 'typeorm';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

@ValidatorConstraint({ async: true })
export class ExistConstraint implements ValidatorConstraintInterface {
    async validate<E>(value: any, args: UniqueValidationArguments<E>): Promise<boolean> {
        const [EntityClass] = args.constraints;
        const repo = getRepository(EntityClass);
        const model = await repo.findOne({
            where: {
                id: value,
            },
        });

        return !isUndefined(model);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Record doest not exist';
    }
}

export function Exist<E>(
    entity: ObjectType<E> | EntitySchema<E> | string,
    validationOptions?: ValidationOptions,
) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entity],
            validator: ExistConstraint,
        });
    };
}
