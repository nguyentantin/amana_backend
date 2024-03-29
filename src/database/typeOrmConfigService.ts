import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get('db.host'),
            port: this.configService.get('db.port'),
            username: this.configService.get('db.username'),
            password: this.configService.get('db.password'),
            database: this.configService.get('db.database'),
            entities: [__dirname + '/../**/**/**/*.entity{.ts,.js}'],
            synchronize: false,
            // logging: true,
            migrationsTableName: 'nest_migrations',
            migrations: ['database/migrations/*.ts'],
            cli: {
                migrationsDir: 'database/migrations',
            },
        };
    }
}
