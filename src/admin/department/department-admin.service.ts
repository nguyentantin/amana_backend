import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from '../../app/department/dto/department.entity';
import { DepartmentAdminRepository } from './department-admin.repository';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { DeepPartial, DeleteResult } from 'typeorm';

@Injectable()
export class DepartmentAdminService {
    constructor(
        @InjectRepository(Department) private readonly departmentAdminRepo: DepartmentAdminRepository,
    ) {
    }

    /**
     * Get list departments.
     */
    async listAndPaginate(search: string|undefined): Promise<PaginationDto<Department>> {
        const departments = this.departmentAdminRepo
            .createQueryBuilder('department')
            .leftJoinAndSelect('department.members', 'members')
            .orderBy({
                'department.createdAt': 'DESC',
            });

        if (!isUndefined(search)) {
            departments.where('department.name LIKE :search OR department.description LIKE :search', { search: `%${search}%` });
        }

        return await departments.paginate();
    }

    /**
     * Create department
     *
     * @param data: DeepPartial<Department>
     */
    async create(data: DeepPartial<Department>): Promise<Department> {
        const department = this.departmentAdminRepo.create(data);
        return this.departmentAdminRepo.save(department);
    }

    /**
     * Update department.
     *
     * @param id: number
     * @param data: DeepPartial<Department>
     */
    async update(id: number, data: DeepPartial<Department>): Promise<Department> {
        await this.departmentAdminRepo.update(id, data);
        return await this.departmentAdminRepo.findOne(id);
    }

    /**
     * Deletes a concrete department.
     *
     * @param id: number
     */
    async delete(id: number): Promise<DeleteResult> {
        return await this.departmentAdminRepo.delete(id);
    }
}
