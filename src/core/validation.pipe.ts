import { ArgumentMetadata, Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppLogger } from './logger';
import * as _ from 'lodash';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    private logger = new AppLogger(ValidationPipe.name);

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new UnprocessableEntityException(this.parseErrors(errors));
        }
        return value;
    }

    // tslint:disable-next-line:ban-types
    private toValidate(metatype: Function): boolean {
        // tslint:disable-next-line:ban-types
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private parseErrors(errors) {
        const res = {};
        errors.forEach(item => {
            res[item.property] = _.transform(item.constraints, (result, val, key) => {
                result.push(val);
                return val;
            }, []);
        });

        return res;
    }
}
