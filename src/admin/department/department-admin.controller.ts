import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { CreateDepartmentDto } from '../../app/department/dto/create-department.dto';
import { SuperAuth } from '../../core/decorators/super-auth.decorator';
import { UpdateDepartmentDto } from '../../app/department/dto/update-department.dto';
import { ApiTags } from '@nestjs/swagger';
import { filterByKeys } from '../../helpers';
import { Department } from '../../app/department/dto/department.entity';
import { BaseController } from '../../core/constracts/base.controller';
import { DepartmentAdminService } from './department-admin.service';

@SuperAuth()
@Controller('admin/departments')
@ApiTags('Department-Admin')
export class DepartmentAdminController extends BaseController {
    constructor(
        private readonly departmentService: DepartmentAdminService,
    ) {
        super();
    }

    @Get()
    async listAndPaginate(@Res() res, @Query('search') search: string): Promise<object> {
        const departments = await this.departmentService.listAndPaginate(search);

        return this.responseOk(res, departments);
    }

    @Post()
    async create(@Res() res, @Body() data: CreateDepartmentDto): Promise<object> {
        const createData = filterByKeys(Department.canUpdateColumns(), data);
        const department = await this.departmentService.create(createData);

        return this.responseOk(res, department);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Res() res, @Body() data: UpdateDepartmentDto): Promise<object> {
        const updateData = filterByKeys(Department.canUpdateColumns(), data);
        const department = await this.departmentService.update(Number(id), updateData);

        return this.responseOk(res, department);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res): Promise<object> {
        await this.departmentService.delete(Number(id));

        return this.responseOk(res);
    }
}
