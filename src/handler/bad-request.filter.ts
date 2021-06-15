import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../core/logger';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
    private logger = new AppLogger(BadRequestFilter.name);

    catch(exception: BadRequestException, host: ArgumentsHost): any {
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
