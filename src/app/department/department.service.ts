import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './dto/department.entity';
import { DepartmentAdminRepository } from '../../admin/department/department-admin.repository';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo: DepartmentAdminRepository,
    ) {
    }

    async all() {
        return await this.departmentRepo.find({ order: { createdAt: 'DESC' } });
    }
}
