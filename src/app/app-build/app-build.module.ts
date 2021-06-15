import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppBuildController } from './app-build.controller';
import { AppBuildService } from './app-build.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppBuild } from './dto/app-build.entity';
import { Project } from '../project/dto/project.entity';
import { AwsModule } from '../aws/aws.module';
import { NotifyModule } from '../notify/notify.module';
import { AppBuildRepository } from './app-build.repository';
import { BuildConfigModule } from '../build-config/build-config.module';
import { DownloadHistoryModule } from '../download-history/download-history.module';
import { PaginationMiddleware } from '../../core/pagination/pagination.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([AppBuild, Project, AppBuildRepository]),
        AwsModule,
        NotifyModule,
        BuildConfigModule,
        DownloadHistoryModule,
    ],
    controllers: [AppBuildController],
    providers: [AppBuildService],
    exports: [AppBuildService],
})

export class AppBuildModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(PaginationMiddleware)
            .forRoutes({ path: 'app-builds', method: RequestMethod.GET });
    }
}
