import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HandlebarsAdapter, MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { Config } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { TestModule } from './app/test/test.module';
import { ProjectModule } from './app/project/project.module';
import { AppBuildModule } from './app/app-build/app-build.module';
import { StorageModule } from './app/storage/storage.module';
import { LogModule } from './app/log/log.module';
import { InviteModule } from './app/invite/invite.module';
import { OptionModule } from './app/option/option.module';
import { ProjectSettingModule } from './app/project-setting/project-setting.module';
import { BuildRequestModule } from './app/build-request/build-request.module';
import { AwsModule } from './app/aws/aws.module';
import { TimeTrackingModule } from './app/time-tracking/time-tracking.module';
import { MailModule } from './app/mail/mail.module';
import { contextMiddleware } from './core/middelwares';
import { RoleModule } from './app/role/role.module';
import { UserRoleModule } from './app/user-roles/user-role.module';
import { NotifyModule } from './app/notify/notify.module';
import { BuildConfigModule } from './app/build-config/build-config.module';
import { DownloadHistoryModule } from './app/download-history/download-history.module';
import { PaginationMiddleware } from './core/pagination/pagination.middleware';
import { EmailConfirmationModule } from './app/email-confirmation/email-confirmation.module';
import { PasswordModule } from './app/password/password.module';
import { UserAdminModule } from './admin/user/user-admin.module';
import { AuthAdminModule } from './admin/auth/auth-admin.module';
import { ProjectAdminModule } from './admin/project/project-admin.module';
import { DepartmentModule } from './app/department/department.module';
import { DepartmentAdminModule } from './admin/department/department-admin.module';
import { RateLimiterInterceptor, RateLimiterModule } from './core/rate-limiter';

@Module({
    imports: [Config, DatabaseModule, UserModule, AuthModule, TestModule, ProjectAdminModule, AppBuildModule, StorageModule,
        LogModule, InviteModule, OptionModule, ProjectSettingModule, BuildRequestModule,
        AwsModule, TimeTrackingModule, MailModule, RoleModule, UserRoleModule, NotifyModule, BuildConfigModule, DownloadHistoryModule,
        EmailConfirmationModule, PasswordModule, UserAdminModule, ProjectModule,
        RateLimiterModule.register({
            /** 4 request per seconds */
            type: process.env.RATE_LIMIT_DRIVER,
            points: parseInt(process.env.RATE_LIMIT_POINT, 10),
            duration: parseInt(process.env.RATE_LIMIT_DURATION, 10),
            keyPrefix: 'RateLimiter',
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_SMTP_HOST,
                port: process.env.MAIL_SMTP_PORT,
                secure: process.env.MAIL_SMTP_SSL,
                auth: {
                    user: process.env.MAIL_SMTP_USERNAME,
                    pass: process.env.MAIL_SMTP_PASSWORD,
                },
            },
            defaults: {
                from: process.env.MAIL_SMTP_FROM,
            },
            template: {
                dir: join(__dirname, '../templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        AuthAdminModule,
        DepartmentModule,
        DepartmentAdminModule,
    ],
    controllers: [],
    providers: [
        /** Register globally with above config */
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void  {
        consumer.apply(contextMiddleware).forRoutes('*');
        consumer.apply(PaginationMiddleware).forRoutes('*');
    }
}
