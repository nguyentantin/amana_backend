import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../app/department/dto/department.entity';
import { DepartmentAdminRepository } from './department-admin.repository';
import { DepartmentAdminController } from './department-admin.controller';
import { DepartmentAdminService } from './department-admin.service';
import { UniqueValidatorMiddleware } from '../../core/middelwares/unique-validator.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([Department, DepartmentAdminRepository])],
    providers: [DepartmentAdminService],
    controllers: [DepartmentAdminController],
})
export class DepartmentAdminModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(UniqueValidatorMiddleware)
            .forRoutes({ path: 'admin/departments/:id', method: RequestMethod.PUT });
    }
}
