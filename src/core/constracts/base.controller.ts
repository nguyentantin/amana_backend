import { HttpStatus } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

export class BaseController {
    protected responseOk(res: any, data?: any): object {
        if (isUndefined(data)) {
            return res.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                status: 'OK',
            });
        }

        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            status: 'OK',
            data: classToPlain(data),
        });
    }
}
