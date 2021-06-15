import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../core/logger';

@Catch(HttpException)
export class DupEntryFilter implements ExceptionFilter {
    private logger = new AppLogger(DupEntryFilter.name);

    catch(exception: HttpException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status)
            .json({
                statusCode: status,
                error: exception.getResponse(),
            });
    }
}
