import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import database from './db.config';
import app from './app.config';
import aws from './aws.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [database, app, aws],
            isGlobal: true,
        }),
    ],
})
export class Config {
}
