import { Controller, Get, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../core/constracts/base.controller';
import { DepartmentService } from './department.service';

@Controller('departments')
@ApiTags('Department')
export class DepartmentController extends BaseController {
    constructor(
        private readonly departmentService: DepartmentService,
    ) {
        super();
    }

    @Get()
    async all(@Response() res): Promise<object> {
        const departments = await this.departmentService.all();
        return this.responseOk(res, departments);
    }
}
