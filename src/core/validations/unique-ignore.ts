import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { UniqueValidationArguments } from './unique';
import { EntitySchema, Equal, getRepository, Not, ObjectType } from 'typeorm';
import { ContextService } from '../providers/context.service';
import { Constants } from '../constants/Constants';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

@ValidatorConstraint({ async: true })
export class UniqueIgnoreConstraint implements ValidatorConstraintInterface {
    async validate<E>(value: any, args: UniqueValidationArguments<E>): Promise<boolean> {
        const [EntityClass] = args.constraints;
        const repo = getRepository(EntityClass);
        const id = ContextService.get(Constants.IGNORE_ID);
        let condition = { [args.property]: value };

        if (!isUndefined(id)) {
            condition = {
                ...condition,
                id: Not(Equal(id)),
            };
        }

        const model = await repo.findOne({
            where: condition,
        });

        return isUndefined(model);
    }
}

export function UniqueIgnore<E>(
    entity: ObjectType<E> | EntitySchema<E> | string,
    validationOptions?: ValidationOptions,
) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entity],
            validator: UniqueIgnoreConstraint,
        });
    };
}
