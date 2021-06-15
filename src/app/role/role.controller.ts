import { Controller, Get, HttpStatus, Response } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './dto/role.entity';
import { Auth } from '../../core/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Permission')
export class RoleController {
    constructor(private readonly roleService: RoleService) {
    }

    @Get()
    @Auth()
    async all(@Response() res): Promise<Role[]> {
        const roles = await this.roleService.all();

        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            status: 'OK',
            data: roles,
        });
    }
}
