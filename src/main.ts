import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

import { AppModule } from './app.module';
import { AppLogger } from './core/logger';
import { ValidationPipe } from './core/validation.pipe';
import './core/pagination/custom-query-builder';
import { BadRequestFilter } from './handler/bad-request.filter';
import { DupEntryFilter } from './handler/dup-entry.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new AppLogger(),
    });
    const basicAuthUser = process.env.BASIC_AUTH_USER || 'amana';
    const basicAuthPass = process.env.BASIC_AUTH_PASS || 'si1@2020';
    const options = new DocumentBuilder()
        .setTitle('Amana API Documentation')
        .setDescription('Amana API Documentation')
        .setVersion('1.0')
        .addTag('Auth')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    app.use('/documentation', basicAuth({
        challenge: true,
        users: { [basicAuthUser]: basicAuthPass },
    }));
    SwaggerModule.setup('/documentation', app, document);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new BadRequestFilter());
    app.useGlobalFilters(new DupEntryFilter());
    app.enableCors();
    await app.listen(3003);
}

bootstrap();
