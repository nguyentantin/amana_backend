import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './dto/department.entity';
import { DepartmentService } from './department.service';
import { DepartmentRepository } from './department.repository';
import { DepartmentController } from './department.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Department, DepartmentRepository]),
    ],
    providers: [DepartmentService],
    controllers: [DepartmentController],
})
export class DepartmentModule {}
